#!/bin/bash
set -e

echo "==========================================="
echo " Déploiement NIDALUM Social Publisher (MVP)"
echo "==========================================="

PROJECT_ID=$(gcloud config get-value project)
REGION="europe-west1"
SERVICE_NAME="nidalum-social-bot"

echo "Project ID : $PROJECT_ID"
echo "Region     : $REGION"
echo "Service    : $SERVICE_NAME"
echo "==========================================="

# Vérification que Secret Manager est activé
gcloud services enable secretmanager.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudtasks.googleapis.com

# Lancement de Cloud Build
echo "Lancement du Build & Déploiement via Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

echo "==========================================="
echo " Déploiement terminé avec succès !"
echo "==========================================="
