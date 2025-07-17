
# PlannerRun - Implantação com Kubernetes e Helm

Aplicação completa desenvolvida para a disciplina de **DevOps**, focada na conteinerização e orquestração de uma aplicação multicamada com Kubernetes e Helm. O projeto simula um sistema de geração de planos de corrida personalizados, utilizando uma API em Flask, frontend em Next.js e banco de dados PostgreSQL.

## 👨‍💻 Autor

  - **Eduardo Henrique Spinelli**
  - **RA:** 800220
  - **Curso:** Ciência da Computação
  - **Departamento de Computação** – São Carlos, SP
  - **Professor:** Delano Medeiros Beder

## 🧱 Arquitetura e Tecnologias

A aplicação é orquestrada no Kubernetes e utiliza os seguintes componentes e tecnologias:

| Categoria | Tecnologia/Componente |
| :--- | :--- |
| **Orquestração** | Kubernetes (Minikube), Helm |
| **Conteinerização** | Docker |
| **Backend** | Python 3.10, Flask, Gunicorn |
| **Frontend** | Node.js, React (Next.js), Nginx |
| **Banco de Dados** | PostgreSQL 15 |
| **Gateway de Pagamento** | Stripe API |
| **Gateway de Email** | SMTP (Gmail) |

A implantação no Kubernetes é gerenciada por um Helm Chart que define os seguintes recursos:

  * **Deployments** para os serviços de `backend`, `frontend` e `db`.
  * **Services** para a comunicação interna entre os componentes.
  * **Ingress** para expor o frontend na URL `k8s.local`.
  * **PersistentVolumeClaim** para garantir a persistência dos dados do PostgreSQL.
  * **ConfigMap** para o script de inicialização do banco de dados.
  * **Secrets** para o gerenciamento seguro de credenciais e chaves de API.

## 🚀 Como Executar a Aplicação no Minikube

Siga os passos abaixo para implantar a aplicação em um cluster Minikube local de forma automatizada e segura.

### Pré-requisitos

  * Docker
  * Minikube
  * Helm
  * `kubectl`

### Passo 1: Preparar o Ambiente

Clone o repositório para a sua máquina local:

```bash
git clone https://github.com/Edu-Spinelli/T1-DevOps-Plannerrun.git
cd T1-DevOps-Plannerrun
```

### Passo 2: Configurar os Segredos

Crie um arquivo chamado `secrets.values.yaml` dentro da pasta `helm/`. Este arquivo conterá todas as suas credenciais e **não deve ser versionado no Git**.

Use o seguinte modelo para o seu `secrets.values.yaml`:

```yaml
# Este arquivo contém segredos e NÃO DEVE ser comitado no Git.
secrets:
  DB_NAME: "plannerrun"
  DB_USER: "seu_usuario_db"
  DB_PASSWORD: "sua_senha_db"
  SMTP_SERVER: "smtp.gmail.com"
  SMTP_PORT: "587"
  SENDER_EMAIL: "seu_email@gmail.com"
  APP_PASSWORD: "sua_senha_de_app_gmail"
  STRIPE_API_KEY: "sua_chave_secreta_stripe"
  PRICE_ID_3_MONTHS: "seu_price_id"
  PRICE_ID_4_MONTHS: "seu_price_id"
  PRICE_ID_5_MONTHS: "seu_price_id"
  PRICE_ID_6_MONTHS: "seu_price_id"
```

**Atenção:** Certifique-se de que o arquivo `secrets.values.yaml` está listado no seu `.gitignore`.

### Passo 3: Executar o Script de Implantação

O script `deploy-to-minikube.sh` automatiza todo o processo: inicia o Minikube, constrói as imagens, atualiza o `/etc/hosts` e instala o Helm chart.

Conceda permissão de execução e rode o script:

```bash
chmod +x deploy-to-minikube.sh
./deploy-to-minikube.sh
```

O script poderá solicitar sua senha de `sudo` para modificar o arquivo `/etc/hosts` e apontar `k8s.local` para o IP do Minikube.

### Passo 4: Acessar a Aplicação

Após a conclusão do script, a aplicação estará disponível no seu navegador no seguinte endereço:

  * **Frontend:** [http://k8s.local](http://k8s.local)

## 📂 Estrutura do Projeto

```
.
├── backend/                # Código-fonte da API Flask
├── banco/                  # Script de inicialização do DB
├── frontend/               # Código-fonte da aplicação Next.js
├── helm/
│   ├── secrets.values.yaml  # Arquivo com segredos (NÃO VERSIONADO)
│   └── plannerrun-chart/   # Helm Chart para implantação
│       ├── Chart.yaml
│       ├── templates/
│       │   ├── backend-deployment.yaml
│       │   ├── db-deployment.yaml
│       │   ├── db-pvc.yaml
│       │   ├── frontend-deployment.yaml
│       │   ├── ingress.yaml
│       │   ├── service-account.yaml
│       │   ├── service-backend.yaml
│       │   ├── service-db.yaml
│       │   ├── service-frontend.yaml
│       │   └── secrets.yaml
│       └── values.yaml     # Valores padrão do Chart (sem segredos)
├── .gitignore
├── deploy-to-minikube.sh   # Script de automação do deploy
├── docker-compose.yaml     # Para desenvolvimento local (opcional)
├── README.md
```

## 📝 Licença

Uso educacional. Projeto desenvolvido como prática para a disciplina de DevOps – UFSCar.