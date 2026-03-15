FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    git-lfs \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Generate a user for HF Spaces (optional but recommended)
RUN useradd -m -u 1000 user
RUN mkdir -p /app /data && chown user:user /app /data

USER user
ENV PATH="/home/user/.local/bin:${PATH}"

WORKDIR /app

# Install python dependencies
RUN pip install --no-cache-dir --user huggingface_hub

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy all files
COPY --chown=user . .

# Set permissions for startup script
RUN chmod +x start.sh

EXPOSE 7860

# Start via shell script
CMD ["bash", "start.sh"]
