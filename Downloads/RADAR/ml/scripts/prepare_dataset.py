from __future__ import annotations

import argparse
import random
import shutil
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = PROJECT_ROOT / "UPN, MINTA SANGU KE FINAL PLS_Tahap2_FindIT2026" / "test_data" / "test"
RAW_ROOT = PROJECT_ROOT / "ml" / "data" / "raw"
PROCESSED_ROOT = PROJECT_ROOT / "ml" / "data" / "processed"
REPORTS_ROOT = PROJECT_ROOT / "ml" / "reports"

CLASS_ALIASES = {
    "no-damage": "no_damage",
    "no_damage": "no_damage",
    "minor-damage": "minor_damage",
    "minor_damage": "minor_damage",
    "major-damage": "major_damage",
    "major_damage": "major_damage",
    "destroyed": "destroyed",
}
CLASSES = ["no_damage", "minor_damage", "major_damage", "destroyed"]
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}


def copy_file(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def clear_split_dirs() -> None:
    for split in ["train", "val", "test"]:
        split_root = PROCESSED_ROOT / split
        split_root.mkdir(parents=True, exist_ok=True)
        for cls in CLASSES:
            class_dir = split_root / cls
            if class_dir.exists():
                for file in class_dir.iterdir():
                    if file.is_file() and file.name != ".gitkeep":
                        file.unlink()
            class_dir.mkdir(parents=True, exist_ok=True)
            (class_dir / ".gitkeep").touch()


def discover_images(source: Path) -> dict[str, list[Path]]:
    discovered: dict[str, list[Path]] = {cls: [] for cls in CLASSES}
    for class_dir in sorted(source.iterdir()):
        if not class_dir.is_dir():
            continue
        canonical = CLASS_ALIASES.get(class_dir.name.lower())
        if canonical is None:
            print(f"Skipping unknown class folder: {class_dir.name}")
            continue
        discovered[canonical].extend(
            sorted(path for path in class_dir.iterdir() if path.suffix.lower() in IMAGE_SUFFIXES)
        )
    return discovered


def split_images(images: list[Path], seed: int) -> dict[str, list[Path]]:
    shuffled = images[:]
    random.Random(seed).shuffle(shuffled)
    total = len(shuffled)
    if total == 0:
        return {"train": [], "val": [], "test": []}
    if total < 5:
        return {"train": shuffled, "val": [], "test": []}
    train_end = max(1, int(total * 0.7))
    val_end = train_end + max(1, int(total * 0.15))
    return {
        "train": shuffled[:train_end],
        "val": shuffled[train_end:val_end],
        "test": shuffled[val_end:],
    }


def prepare(source: Path, seed: int) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Dataset source not found: {source}")

    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)
    clear_split_dirs()
    discovered = discover_images(source)

    lines = ["# Dataset Preparation Report", "", f"Source: `{source}`", ""]
    lines.append("| Class | Raw copied | Train | Val | Test |")
    lines.append("|---|---:|---:|---:|---:|")

    for cls in CLASSES:
        raw_class_dir = RAW_ROOT / cls
        raw_class_dir.mkdir(parents=True, exist_ok=True)
        (raw_class_dir / ".gitkeep").touch()

        for image in discovered[cls]:
            copy_file(image, raw_class_dir / image.name)

        split = split_images(discovered[cls], seed)
        for split_name, split_images_for_class in split.items():
            for image in split_images_for_class:
                copy_file(image, PROCESSED_ROOT / split_name / cls / image.name)

        lines.append(
            f"| `{cls}` | {len(discovered[cls])} | {len(split['train'])} | {len(split['val'])} | {len(split['test'])} |"
        )

    missing = [cls for cls, images in discovered.items() if not images]
    if missing:
        lines.extend(
            [
                "",
                "## Notes",
                "",
                "The current UPN dataset does not include these RADAR classes yet: "
                + ", ".join(f"`{cls}`" for cls in missing)
                + ". Training can still smoke-run, but a production four-class model needs examples for every class.",
            ]
        )

    report_path = REPORTS_ROOT / "dataset_prepare_report.md"
    report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(report_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare RADAR image dataset from the UPN source folder.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    prepare(args.source, args.seed)


if __name__ == "__main__":
    main()
