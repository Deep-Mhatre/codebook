FROM python:3.11-slim

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /sandbox

# Install system dependencies for build / graphics
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpng-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pinned Python libraries
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create unprivileged security user
RUN useradd -m -u 1000 codebook_user && chown -R codebook_user:codebook_user /sandbox
USER codebook_user

CMD ["python3"]
