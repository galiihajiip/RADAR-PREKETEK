# Dataset Preparation Report

Source: `C:\Users\Hype\Downloads\UPN, MINTA SANGU KE FINAL PLS_Tahap2_FindIT2026-20260706T140814Z-3-001\UPN, MINTA SANGU KE FINAL PLS_Tahap2_FindIT2026\test_data\test`

| Class | Raw copied | Train | Val | Test |
|---|---:|---:|---:|---:|
| `no_damage` | 0 | 0 | 0 | 0 |
| `minor_damage` | 75 | 52 | 11 | 12 |
| `major_damage` | 0 | 0 | 0 | 0 |
| `destroyed` | 8 | 5 | 1 | 2 |

## Notes

The current UPN dataset does not include these RADAR classes yet: `no_damage`, `major_damage`. Training can still smoke-run, but a production four-class model needs examples for every class.
