from __future__ import annotations

import json
import time
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_ROOT = PROJECT_ROOT / "ml" / "data" / "processed"
MODELS_ROOT = PROJECT_ROOT / "ml" / "models"
REPORTS_ROOT = PROJECT_ROOT / "ml" / "reports"
CLASSES = ["no_damage", "minor_damage", "major_damage", "destroyed"]
WEIGHTS_PATH = MODELS_ROOT / "radar_mobilenetv3_small.pt"


def count_split(split: str) -> dict[str, int]:
    return {
        cls: len([p for p in (PROCESSED_ROOT / split / cls).glob("*") if p.is_file() and p.name != ".gitkeep"])
        for cls in CLASSES
    }


def write_fallback_meta(counts: dict, note: str) -> dict:
    available_classes = [cls for cls in CLASSES if counts["train"][cls] > 0]
    meta = {
        "model": "MobileNetV3-Small",
        "status": "dataset-indexed-demo-fallback",
        "classes": CLASSES,
        "available_train_classes": available_classes,
        "counts": counts,
        "note": note,
    }
    (MODELS_ROOT / "model_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return meta


def main() -> None:
    MODELS_ROOT.mkdir(parents=True, exist_ok=True)
    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)

    counts = {split: count_split(split) for split in ["train", "val", "test"]}
    available_classes = [cls for cls in CLASSES if counts["train"][cls] > 0]

    try:
        import torch
    except ImportError:
        meta = write_fallback_meta(
            counts, "Install torch/torchvision and add all four class folders before production training."
        )
        (REPORTS_ROOT / "training_report.md").write_text(
            "# Training Report\n\n"
            "torch is not installed. This smoke step only indexed the prepared dataset and refreshed "
            "`ml/models/model_meta.json`. Flask stays in deterministic fallback mode.\n",
            encoding="utf-8",
        )
        print(json.dumps(meta, indent=2))
        return

    if len(available_classes) < 2:
        meta = write_fallback_meta(
            counts, f"Only {len(available_classes)} class(es) have training images; need at least 2 to fine-tune."
        )
        print(json.dumps(meta, indent=2))
        return

    import torch.nn as nn
    from torch.utils.data import DataLoader, WeightedRandomSampler
    from torchvision import datasets, models, transforms

    IMAGENET_MEAN = [0.485, 0.456, 0.406]
    IMAGENET_STD = [0.229, 0.224, 0.225]

    train_transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ]
    )
    eval_transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
        ]
    )

    train_dir = PROCESSED_ROOT / "train"
    val_dir = PROCESSED_ROOT / "val"

    train_dataset = datasets.ImageFolder(str(train_dir), transform=train_transform, allow_empty=True)
    val_dataset = datasets.ImageFolder(str(val_dir), transform=eval_transform, allow_empty=True)
    dataset_classes = train_dataset.classes  # alphabetical order, e.g. destroyed, major_damage, minor_damage, no_damage
    num_classes = len(dataset_classes)

    # Class-balanced sampling: this dataset is heavily skewed (52 minor_damage vs 5
    # destroyed in train), so an un-weighted loader would barely ever show the model
    # a destroyed example. WeightedRandomSampler oversamples minority classes per batch.
    class_counts = [0] * num_classes
    for _, label in train_dataset.samples:
        class_counts[label] += 1
    sample_weights = [1.0 / class_counts[label] for _, label in train_dataset.samples]
    sampler = WeightedRandomSampler(sample_weights, num_samples=len(sample_weights), replacement=True)

    train_loader = DataLoader(train_dataset, batch_size=8, sampler=sampler)
    val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False) if len(val_dataset) > 0 else None

    try:
        weights = models.MobileNet_V3_Small_Weights.IMAGENET1K_V1
        model = models.mobilenet_v3_small(weights=weights)
        pretrained = True
    except Exception:
        model = models.mobilenet_v3_small(weights=None)
        pretrained = False

    # Freeze the feature extractor and only fine-tune the classifier head: with ~60
    # training images total, training the full 2.5M-param backbone would just overfit.
    for param in model.features.parameters():
        param.requires_grad = False
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)

    device = torch.device("cpu")
    model.to(device)

    optimizer = torch.optim.Adam(model.classifier.parameters(), lr=1e-3)
    criterion = nn.CrossEntropyLoss()

    epochs = 15
    model.train()
    history = []
    for epoch in range(epochs):
        running_loss = 0.0
        correct = 0
        total = 0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            correct += (outputs.argmax(1) == labels).sum().item()
            total += images.size(0)
        history.append({"epoch": epoch + 1, "loss": running_loss / total, "train_acc": correct / total})

    val_accuracy = None
    val_per_class: dict[str, dict[str, int]] = {}
    if val_loader is not None and len(val_dataset) > 0:
        model.eval()
        correct = 0
        total = 0
        per_class_correct = {cls: 0 for cls in dataset_classes}
        per_class_total = {cls: 0 for cls in dataset_classes}
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                preds = outputs.argmax(1)
                correct += (preds == labels).sum().item()
                total += images.size(0)
                for label, pred in zip(labels.tolist(), preds.tolist()):
                    cls = dataset_classes[label]
                    per_class_total[cls] += 1
                    if pred == label:
                        per_class_correct[cls] += 1
        val_accuracy = correct / total if total > 0 else None
        val_per_class = {
            cls: {"correct": per_class_correct[cls], "total": per_class_total[cls]} for cls in dataset_classes
        }

    MODELS_ROOT.mkdir(parents=True, exist_ok=True)
    torch.save({"state_dict": model.state_dict(), "classes": dataset_classes}, WEIGHTS_PATH)

    # Measure real single-image inference latency on CPU, same preprocessing path
    # Flask will use, so the number reported is honest rather than assumed.
    model.eval()
    dummy = torch.zeros(1, 3, 224, 224)
    with torch.no_grad():
        model(dummy)  # warm-up
        start = time.perf_counter()
        for _ in range(20):
            model(dummy)
        inference_ms = (time.perf_counter() - start) / 20 * 1000

    weights_size_mb = WEIGHTS_PATH.stat().st_size / (1024 * 1024)
    missing_classes = [cls for cls in CLASSES if cls not in dataset_classes or counts["train"][cls] == 0]

    meta = {
        "model": "MobileNetV3-Small",
        "status": "trained-poc",
        "model_version": f"poc-v1-{int(time.time())}",
        "pretrained_backbone": pretrained,
        "classes": dataset_classes,
        "num_classes": num_classes,
        "missing_classes": missing_classes,
        "counts": counts,
        "epochs": epochs,
        "train_history": history,
        "val_accuracy": val_accuracy,
        "val_per_class": val_per_class,
        "weights_path": str(WEIGHTS_PATH.relative_to(PROJECT_ROOT)),
        "weights_size_mb": round(weights_size_mb, 2),
        "measured_inference_ms": round(inference_ms, 2),
        "note": (
            "Proof-of-concept only: trained on a small, incomplete dataset "
            f"(missing classes: {missing_classes or 'none'}). Not the production 4-class, "
            "85%+-accuracy model described in the proposal - needs a full labeled dataset "
            "(e.g. xBD) before production use."
        ),
    }
    (MODELS_ROOT / "model_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")

    report_lines = [
        "# Training Report",
        "",
        f"Status: **{meta['status']}**",
        f"Pretrained ImageNet backbone: {pretrained}",
        f"Classes trained: {', '.join(dataset_classes)}",
        f"Missing classes (no data): {', '.join(missing_classes) if missing_classes else 'none'}",
        f"Epochs: {epochs}",
        f"Final train accuracy: {history[-1]['train_acc']:.3f}" if history else "",
        f"Val accuracy: {val_accuracy:.3f}" if val_accuracy is not None else "Val accuracy: n/a",
        f"Measured CPU inference latency: {inference_ms:.2f} ms/image",
        f"Weights size: {weights_size_mb:.2f} MB at `{meta['weights_path']}`",
        "",
        "## Honest limitation",
        "",
        meta["note"],
    ]
    (REPORTS_ROOT / "training_report.md").write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
