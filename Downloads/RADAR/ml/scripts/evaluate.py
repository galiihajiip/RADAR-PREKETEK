from __future__ import annotations

import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODELS_ROOT = PROJECT_ROOT / "ml" / "models"
REPORTS_ROOT = PROJECT_ROOT / "ml" / "reports"


def main() -> None:
    meta_path = MODELS_ROOT / "model_meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}
    counts = meta.get("counts", {})
    test_counts = counts.get("test", {})
    total_test = sum(test_counts.values()) if isinstance(test_counts, dict) else 0

    report = [
        "# Evaluation Report",
        "",
        f"Model status: `{meta.get('status', 'missing')}`",
        f"Test images indexed: `{total_test}`",
        "",
        "No accuracy metric is reported yet because the current demo model is deterministic fallback, not a trained TorchScript classifier.",
        "Once all four classes are present and training is enabled, this script should write accuracy, macro F1, confusion matrix, and per-class recall.",
    ]
    REPORTS_ROOT.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_ROOT / "evaluation_report.md"
    report_path.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(report_path)


if __name__ == "__main__":
    main()
