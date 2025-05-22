from flask import Flask, request, jsonify, send_file
import os
import logging
import json
import stripe
from flask_cors import CORS
from db import get_db_connection
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from pathlib import Path


env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)



# Configuração SMTP
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT") 
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")

stripe.api_key = os.getenv("STRIPE_API_KEY")

# Map mesesAcompanhamento to Stripe price IDs
PRICE_IDS = {
    3: os.getenv("PRICE_ID_3_MONTHS"),  
    4: os.getenv("PRICE_ID_4_MONTHS"),  # 4-meses (AQUI TEM QUE MUDAR PELO ID DE VERDADE)
    5: os.getenv("PRICE_ID_5_MONTHS"),  # 5-meses (AQUI TBM)
    6: os.getenv("PRICE_ID_6_MONTHS"),  # 6-meses 
}

# Configuração do Flask e Logging
app = Flask(__name__)
# Configurações devem vir DEPOIS de criar a instância 'app'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
app.config['JSON_SORT_KEYS'] = False
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://plannerrun.com",
            "https://www.plannerrun.com"
        ],
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config.update({
    'CORS_SUPPORTS_CREDENTIALS': True,
    'CORS_EXPOSE_HEADERS': ['Content-Type', 'Authorization'],
    'CORS_ALLOW_HEADERS': ['Content-Type', 'Authorization']
})


@app.route("/api/save_user_input", methods=["POST"])
def save_user_input():
    try:
        data = request.json
        altura = data.get("altura")
        peso = data.get("peso")
        idade = data.get("idade")
        objetivo = data.get("objetivo")
        dias = data.get("dias")
        meses = data.get("meses")
        nivel = data.get("nivel")
        email = data.get("email")

        # Validação simples
        if not all([altura, peso, idade, objetivo, dias, meses, nivel, email]):
            return jsonify({"error": "Todos os campos são obrigatórios"}), 400

        # Conexão com o banco
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados no banco
        cursor.execute("""
            INSERT INTO clientes (altura, peso, idade, objetivo, dias, meses, nivel, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (altura, peso, idade, objetivo, dias, meses, nivel, email))
        user_id = cursor.fetchone()[0]

        # Confirma a transação
        conn.commit()

        # Fecha a conexão
        cursor.close()
        conn.close()

        return jsonify({"message": "Dados salvos com sucesso!", "user_id": user_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.json
        meses = data.get("mesesAcompanhamento")

        # Validar mesesAcompanhamento
        if meses not in PRICE_IDS:
            logging.error(f"Valor inválido para mesesAcompanhamento: {meses}")
            return jsonify({"error": "Valor inválido para mesesAcompanhamento"}), 400

        price_id = PRICE_IDS[meses]

        # Criar a sessão do Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="payment",
            success_url=f"http://localhost:3000/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url="http://localhost:3000",
            customer_email=data.get("email"),
            phone_number_collection={"enabled": True},
            allow_promotion_codes=True,
            metadata={
                "altura": data.get("altura"),
                "peso": data.get("peso"),
                "idade": data.get("idade"),
                "objetivo": data.get("objetivo"),
                "dias": data.get("diasDisponiveis"),
                "meses": meses,
                "nivel": data.get("nivelAtual"),
                "email": data.get("email"),
            },
        )

        return jsonify({"url": session.url})

    except Exception as e:
        logging.error(f"Erro ao criar sessão de checkout: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500



@app.route("/api/payment-details", methods=["GET"])
def payment_details():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "ID da sessão ausente."}), 400

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        metadata = session.get("metadata", {})
        email = metadata.get("email")

        # Conectar ao banco de dados e salvar os dados
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO clientes (altura, peso, idade, objetivo, dias, meses, nivel, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            metadata.get("altura"),
            metadata.get("peso"),
            metadata.get("idade"),
            metadata.get("objetivo"),
            metadata.get("dias"),
            metadata.get("meses"),
            metadata.get("nivel"),
            email
        ))
        user_id = cursor.fetchone()[0]

        # Confirma a transação
        conn.commit()
        cursor.close()
        conn.close()

        # Construir o corpo do e-mail
        subject = "Confirmação de Pagamento - Plano de Treinamento"
        body = f"""
        Olá,

        Seu pagamento foi bem-sucedido! Obrigado por adquirir nosso plano de treinamento personalizado.

        Aqui estão os seus dados cadastrados:
        - Email: {email} 
        - Idade: {metadata.get('idade')} anos
        - Altura: {metadata.get('altura')} cm
        - Peso: {metadata.get('peso')} kg
        - Objetivo: {metadata.get('objetivo')}
        - Dias disponíveis por semana: {metadata.get('dias')}
        - Meses de acompanhamento: {metadata.get('meses')}
        - Nível: {metadata.get('nivel')}

        Caso encontre alguma inconsistência ou tenha dúvidas, entre em contato conosco no email: plannerrun@gmail.com

        Atenciosamente,
        Equipe de Suporte
        """

        # Enviar o e-mail de confirmação
        send_email(email, subject, body)

        return jsonify({
            "user_id": user_id,
            "altura": metadata.get("altura"),
            "peso": metadata.get("peso"),
            "idade": metadata.get("idade"),
            "objetivo": metadata.get("objetivo"),
            "dias": metadata.get("dias"),
            "meses": metadata.get("meses"),
            "nivel": metadata.get("nivel"),
            "email": metadata.get("email"),
            "email_status": "E-mail enviado com sucesso.",
            "db_status": "Dados salvos no banco com sucesso."
        })

    except Exception as e:
        return jsonify({"error": f"Erro ao buscar detalhes do pagamento e salvar no banco: {e}"}), 500


@app.route("/api/clientes-count", methods=["GET"])
def clientes_count():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM clientes")
        count = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return jsonify({"count": count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

















def send_email(recipient_email, subject, body):
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = SENDER_EMAIL
        msg["To"] = recipient_email
        msg.set_content(body)

        # Configuração do servidor SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
            logging.info(f"E-mail enviado com sucesso para {recipient_email}")
    except Exception as e:
        logging.error(f"Erro ao enviar o e-mail: {e}")













if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
