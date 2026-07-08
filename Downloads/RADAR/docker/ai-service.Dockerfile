FROM python:3.11-slim
WORKDIR /app
COPY apps/ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
COPY apps/ai-service .
EXPOSE 5001
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5001/health')" || exit 1
CMD ["gunicorn", "-b", "0.0.0.0:5001", "-w", "2", "app:app"]
