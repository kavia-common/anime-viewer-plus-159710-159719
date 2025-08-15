#!/bin/bash
cd /home/kavia/workspace/code-generation/anime-viewer-plus-159710-159719/anime_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

