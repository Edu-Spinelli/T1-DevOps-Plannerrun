#!/bin/bash

# Exit immediately if any command fails
set -e

# --- Configurações -----------------------------------------------------------
SECRETS_FILE="./helm/secrets.values.yaml"
CHART_PATH="./helm/plannerrun-chart"
CHART_NAME="plannerrun"
HOST_NAME="k8s.local"

# --- 0. Validação de Segredos ----------------------------------------------
if [ ! -f "$SECRETS_FILE" ]; then
  echo "❌ Erro: Arquivo de segredos '$SECRETS_FILE' não encontrado."
  echo "👉 Crie o arquivo com suas credenciais antes de continuar."
  exit 1
fi
echo "✅ Arquivo de segredos '$SECRETS_FILE' encontrado."

# --- 1. Cluster & Add-ons ---------------------------------------------------
printf "\n👉 Iniciando Minikube…\n"
minikube start --driver=docker

printf "\n👉 Habilitando addon Ingress…\n"
minikube addons enable ingress
# Espera um pouco para o Ingress Controller ficar pronto
echo "⏳ Aguardando o Ingress Controller ficar pronto..."
sleep 20

# --- 2. Docker (usa daemon interno do Minikube) -----------------------------
printf "\n👉 Configurando ambiente Docker para apontar para o Minikube…\n"
eval "$(minikube -p minikube docker-env)"

# --- 3. Build das imagens ---------------------------------------------------
printf "\n🛠️  Construindo imagem do backend…\n"
docker build -t backend-plannerrun:latest ./backend

printf "\n🛠️  Construindo imagem do frontend…\n"
docker build -t frontend-plannerrun:latest ./frontend

# --- 4. /etc/hosts ----------------------------------------------------------
MINIKUBE_IP=$(minikube ip)
HOSTS_ENTRY="$MINIKUBE_IP $HOST_NAME"

if grep -q "$HOST_NAME" /etc/hosts; then
  echo "✅ Entrada '$HOST_NAME' já existe em /etc/hosts."
else
  echo "🔑 Adicionando '$HOSTS_ENTRY' ao /etc/hosts (pode ser necessário senha sudo)…"
  echo "$HOSTS_ENTRY" | sudo tee -a /etc/hosts > /dev/null
fi

# --- 5. Helm upgrade/install -----------------------------------------------
printf "\n🚀 Instalando/Atualizando o Helm Chart '$CHART_NAME'…\n"

helm upgrade --install "$CHART_NAME" "$CHART_PATH" \
  -f "$SECRETS_FILE" \
  --set ingress.host="$HOST_NAME" \
  --wait --timeout 5m --debug

# --- 6. Conclusão -----------------------------------------------------------
echo -e "\n🎉 Implantação concluída com sucesso!"
echo "👉 Acesse a aplicação em: http://$HOST_NAME"
echo ""
echo "Comandos úteis:"
echo "  - Ver pods:      kubectl get pods"
echo "  - Ver serviços:  kubectl get svc,ing"
echo "  - Logs backend:  kubectl logs -l app=backend -f"
echo "  - Parar cluster: minikube stop"