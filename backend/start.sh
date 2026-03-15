#!/bin/bash

# Check if /data/chroma_db exists and is not empty
if [ "$(ls -A /data/chroma_db 2>/dev/null)" ]; then
    echo "ChromaDB already present, skipping download"
else
    echo "ChromaDB not found or empty, downloading from Hugging Face Datasets..."
    python3 -c "
from huggingface_hub import snapshot_download
import os

token = os.getenv('HF_TOKEN')
if not token:
    print('Error: HF_TOKEN environment variable not set')
    exit(1)

snapshot_download(
    repo_id='MagatteDiene/tspec-llm-chromadb',
    repo_type='dataset',
    local_dir='/data/chroma_db',
    token=token
)
"
    echo "Download complete."
fi

# Always start uvicorn
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 7860
