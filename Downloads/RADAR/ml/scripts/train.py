from __future__ import annotations

import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_ROOT = PROJECT_ROOT / "ml" / "data" / "processed"
MODELS_ROOT = PROJECT_ROOT / "ml" / "models"
REPORTS_ROOT = PROJECT_ROOT / "ml" / "reports"
CLASSES = ["no_damage", "minor_damage", "major_damage", "destroyed"]


def count_split(split: str) -> dict[str, int]:
    return {
        cls: len([p for p in (PROCESSED_ROOT / split / cls).glob("*") if p.is_file() and p.name != ".gitkeep"])
        for cls in CLASSES
    }


def main() -> None:
    MODELS_ROOT.mkdir(parents=True, exist_ok=True)
    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)

    counts = {split: count_split(split) for split in ["train", "val", "test"]}
    available_classes = [cls for cls in CLASSES if counts["train"][cls] > 0]
    meta = {
        "model": "MobileNetV3-Small",
        "status": "dataset-indexed-demo-fallback",
        "classes": CLASSES,
        "available_train_classes": available_classes,
        "counts": counts,
        "note": "Install torch/torchvision and add all four class folders before production training.",
    }

    (MODELS_ROOT / "model_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (REPORTS_ROOT / "training_report.md").write_text(
        "# Training Report\n\n"
        "This smoke step indexed the prepared dataset and refreshed `ml/models/model_meta.json`.\n"
        "The current repository keeps Flask AI in deterministic fallback mode until a complete four-class dataset is available.\n",
        encoding="utf-8",
    )
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
