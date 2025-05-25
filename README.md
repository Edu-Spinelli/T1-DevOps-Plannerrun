# PlannerRun - Aplicação Dockerizada

Aplicação completa desenvolvida para a disciplina de **DevOps**, focada em conteinerização com Docker. O projeto simula um sistema de geração de planos de corrida personalizados com inteligência artificial, integrado a Stripe, banco de dados PostgreSQL e frontend em React/Next.js.

---

## 👨‍💻 Autor

- **Eduardo Henrique Spinelli**
- RA: 800220
- Curso: Ciência da Computação
- Departamento de Computação – São Carlos, SP
- Professor: Delano Medeiros Beder

---

## 📦 Estrutura da Aplicação

A aplicação é composta por **três containers Docker**:

| Container | Descrição |
|----------|-----------|
| **backend** | API Flask que processa dados do usuário, realiza integração com Stripe, envia e-mails via SMTP e acessa o banco de dados PostgreSQL. |
| **frontend** | Aplicação Next.js (React) que coleta os dados do usuário e exibe informações dinâmicas como a contagem de clientes. |
| **db** | Banco de dados PostgreSQL com criação automática da tabela `clientes` via script `init.sql`. |

---

## 🧱 Tecnologias Utilizadas

- **Docker / Docker Compose**
- **Python 3.10 + Flask**
- **Node.js + React + Next.js**
- **PostgreSQL 15**
- **Stripe API**
- **SMTP via Gmail**
- **Volume Docker para persistência de banco**

---

## 🚀 Como Executar

### Pré-requisitos:
- Docker
- Docker Compose
- Arquivo `.env` configurado com as variáveis necessárias

### Passos:

```bash
# Clone o repositório
git clone https://github.com/Edu-Spinelli/T1-DevOps-Plannerrun.git
cd T1-DevOps-Plannerrun

# Suba os containers
docker-compose up --build
```

### Acesse:

* Frontend: [http://localhost:80](http://localhost:80)
* Backend API: Disponível internamente para o frontend via rede Docker

---

## 🗃️ Banco de Dados

Ao subir o container `db`, a tabela `clientes` será criada automaticamente com a seguinte estrutura:

```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  altura INTEGER NOT NULL,
  peso INTEGER NOT NULL,
  idade INTEGER NOT NULL,
  objetivo VARCHAR(255) NOT NULL,
  dias INTEGER NOT NULL,
  meses INTEGER NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'ativo'
);
```

---

## 🔁 Persistência com Docker Volumes

A configuração abaixo garante que os dados do PostgreSQL **não sejam perdidos** mesmo após `docker-compose down`:

```yaml
volumes:
  - db_data:/var/lib/postgresql/data
```

---

## 🔐 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente (definidas no arquivo `.env`):

- **Banco de Dados**:
  - `DB_NAME`: Nome do banco de dados
  - `DB_USER`: Usuário do banco de dados
  - `DB_PASSWORD`: Senha do banco de dados
  - `DB_HOST`: Host do banco de dados
  - `DB_PORT`: Porta do banco de dados

- **SMTP**:
  - `SMTP_SERVER`: Servidor SMTP
  - `SMTP_PORT`: Porta SMTP
  - `SENDER_EMAIL`: Email remetente
  - `APP_PASSWORD`: Senha do app Gmail

- **Stripe**:
  - `STRIPE_API_KEY`: Chave API do Stripe
  - `PRICE_ID_3_MONTHS`: ID do preço para 3 meses
  - `PRICE_ID_4_MONTHS`: ID do preço para 4 meses
  - `PRICE_ID_5_MONTHS`: ID do preço para 5 meses
  - `PRICE_ID_6_MONTHS`: ID do preço para 6 meses

---

## 📂 Estrutura do Projeto

```
DevOps/
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── cadastro/
│   │   ├── success/
│   │   └── page.tsx
│   ├── nginx.conf
│   └── Dockerfile
├── banco/
│   ├── init.sql
│   └── Dockerfile
├── docker-compose.yaml
├── .env
└── README.md
```

---

## ✅ Resultado Esperado

Ao subir os containers:

* A aplicação web estará acessível em `localhost:80`
* O backend responderá requisições da API
* O banco armazenará dados dos usuários mesmo após reinicializações
* O Stripe gerenciará pagamentos e redirecionará corretamente
* O número de compradores será exibido em tempo real

---

## 📝 Licença

Uso educacional. Projeto desenvolvido como prática de conteinerização para a disciplina de DevOps – UFSCar.


