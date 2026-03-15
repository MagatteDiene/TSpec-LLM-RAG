@echo off
echo === Push vers GitHub ===
cd C:\Users\DELL\Documents\VSCODE_PROGRAMME\Python\Projet_RAG
git add .
git commit -m %1
git push

echo === Copie vers HuggingFace ===
xcopy /E /H /Y "backend\*" "C:\Users\DELL\Documents\VSCODE_PROGRAMME\Python\tspec-llm-backend\"

echo === Push vers HuggingFace ===
cd C:\Users\DELL\Documents\VSCODE_PROGRAMME\Python\tspec-llm-backend
git add .
git commit -m %1
git push

echo === Deploiement termine ! ===