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
| **backend** | API Flask que processa dados do usuário, realiza integração com Stripe, envia e-mail e acessa o banco de dados. |
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

### Passos:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/plannerrun-devops.git
cd plannerrun-devops

# Suba os containers
docker-compose up --build
```

### Acesse:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000/api/clientes-count](http://localhost:5000/api/clientes-count)

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

## 🔐 CORS e Comunicação entre Containers

O backend está habilitado com CORS para aceitar conexões do frontend, tanto em localhost quanto em ambiente real (`plannerrun.com`). A variável de ambiente `NEXT_PUBLIC_API_URL` é usada no frontend para definir dinamicamente a URL da API.

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
│   ├── (código React/Next.js)
│   └── Dockerfile
├── banco/
│   ├── init.sql
│   └── Dockerfile
└── docker-compose.yml
```

---

## ✅ Resultado Esperado

Ao subir os containers:

* A aplicação web estará acessível em `localhost:3000`
* O backend responderá requisições da API
* O banco armazenará dados dos usuários mesmo após reinicializações
* O Stripe gerenciará pagamentos e redirecionará corretamente
* O número de compradores será exibido em tempo real

---

## 📝 Licença

Uso educacional. Projeto desenvolvido como prática de conteinerização para a disciplina de DevOps – UFSCar.


