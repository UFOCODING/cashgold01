FROM python:3.11-slim

WORKDIR /app

COPY new_backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY new_backend/ .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
