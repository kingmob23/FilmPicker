# film-picker-src/backend/api/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY ../../pyproject.toml ../../poetry.lock /app/

RUN pip install poetry && poetry config virtualenvs.create false && poetry install --no-dev

COPY . /app

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
