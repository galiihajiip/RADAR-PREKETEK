# Dummy Data

RADAR now has deterministic generated data for database load testing, web demo mode, and ML smoke training/testing.

## Generate

```bash
npm run data:generate
npm run ml:train
npm run ml:evaluate
```

Default output:

- `database/seed/0002_dummy_10000_reports.sql` - 10,000 `damage_reports`, plus matching `report_images`, `ai_predictions`, and review rows for validated/rejected/escalated statuses.
- `apps/web/src/data/demo-reports.generated.json` - 10,000 reports used by web APIs, dashboard metrics, analytics, and exports in demo mode.
- `ml/data/raw/{class}/synthetic_*.png` - 2,500 synthetic PNG images per class.
- `ml/data/processed/{train,val,test}/{class}/synthetic_*.png` - split synthetic data for smoke training/testing.
- `ml/data/synthetic_manifest.csv` - file-level class and split manifest.
- `ml/reports/dummy_data_report.md` - generation summary.

The original UPN dataset is preserved in `UPN, MINTA SANGU KE FINAL PLS_Tahap2_FindIT2026/test_data/test` and is not deleted by the dummy generator.

## Notes

Synthetic images are intentionally simple colored/crack-pattern PNGs. They are suitable for pipeline testing, loader validation, UI demos, and train/evaluate smoke tests. They are not a substitute for a production disaster-damage dataset.
