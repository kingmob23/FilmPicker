# film-picker-src/backend/scraper/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["python", "scraper/runner.py"]
