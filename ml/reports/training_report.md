# Training Report

Status: **trained-poc**
Pretrained ImageNet backbone: True
Classes trained: destroyed, major_damage, minor_damage, no_damage
Missing classes (no data): no_damage, major_damage
Epochs: 15
Final train accuracy: 0.772
Val accuracy: 1.000
Measured CPU inference latency: 46.23 ms/image
Weights size: 5.93 MB at `ml\models\radar_mobilenetv3_small.pt`

## Honest limitation

Proof-of-concept only: trained on a small, incomplete dataset (missing classes: ['no_damage', 'major_damage']). Not the production 4-class, 85%+-accuracy model described in the proposal - needs a full labeled dataset (e.g. xBD) before production use.
