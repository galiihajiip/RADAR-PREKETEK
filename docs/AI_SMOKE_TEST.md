# AI Smoke Test

```bash
curl http://localhost:5001/health
curl http://localhost:5001/model-info
curl -F image=@sample.png http://localhost:5001/predict
```

Expected: health status `ok`, model info with four classes, and prediction data containing `severity`, `confidence`, `probabilities`, `model_version`, and `inference_ms`.
