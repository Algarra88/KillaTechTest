# --- STAGE 1: Builder (lightweight image for building) ---
FROM python:3.13-slim AS builder

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install only what's necessary to build psycopg
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies into a temporary location so they can be copied later
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# --- STAGE 2: Runtime (final lightweight image) ---
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
# PYTHONPATH ensures Python can find the copied packages
ENV PYTHONPATH="/install/lib/python3.13/site-packages"
ENV PATH="/install/bin:$PATH"

WORKDIR /app

# Only the PostgreSQL runtime library
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 1. Copy the installed libraries (heavy layer that is cached)
COPY --from=builder /install /install

# 2. Copy the entrypoint script (layer that rarely changes)
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# 3. Copy the application code (layer that changes frequently; placed last)
COPY TasksApp /app/TasksApp/
WORKDIR /app/TasksApp/

ENTRYPOINT ["sh", "/app/entrypoint.sh"]

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
