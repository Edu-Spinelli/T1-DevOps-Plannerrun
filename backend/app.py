# backend/app.py (refatorado)
# ---------------------------------------------------------------------------
# Principais mudanças
#  1. Usa variáveis de ambiente **não‑codificadas em base64** dentro do pod.
#     – Garantimos que o Secret seja montado como plain‑text.
#  2. BASE_URL configurável (k8s.local em dev). Isso evita URLs hard‑coded.
#  3. Lista de ORIGINS ajustada para incluir k8s.local (frontend via ingress).
#  4. Utiliza int(os.getenv("SMTP_PORT", 587))  ‑> evita erro de tipo.
#  5. Tratamento de erro de conexão com Postgres detalhado.
#  6. Success & cancel URL construídos a partir de BASE_URL.
# ---------------------------------------------------------------------------

from __future__ import annotations

import logging
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import Dict, Any

import psycopg2  # db.py pode ser removido ou adaptado – aqui usamos direto
import stripe
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

# ---------------------------------------------------------------------------
# 🔧 0. Carrega .env opcional (útil fora de k8s)
# ---------------------------------------------------------------------------
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path, override=False)

# ---------------------------------------------------------------------------
# 🔧 1. Variáveis de ambiente (SEM base64!)
# ---------------------------------------------------------------------------
BASE_URL: str = os.getenv("BASE_URL", "http://k8s.local")

DB_SETTINGS: Dict[str, str | int] = {
    "dbname": os.getenv("DB_NAME", "plannerrun"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
    "host": os.getenv("DB_HOST", "db-service"),
    "port": int(os.getenv("DB_PORT", 5432)),
}

SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL: str = os.getenv("SENDER_EMAIL", "noreply@example.com")
APP_PASSWORD: str = os.getenv("APP_PASSWORD", "")

stripe.api_key = os.getenv("STRIPE_API_KEY", "")

PRICE_IDS: Dict[int, str] = {
    3: os.getenv("PRICE_ID_3_MONTHS", ""),
    4: os.getenv("PRICE_ID_4_MONTHS", ""),
    5: os.getenv("PRICE_ID_5_MONTHS", ""),
    6: os.getenv("PRICE_ID_6_MONTHS", ""),
}

# ---------------------------------------------------------------------------
# 🔧 2. Flask + CORS
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.config.update(JSONIFY_PRETTYPRINT_REGULAR=False, JSON_SORT_KEYS=False)

FRONT_ORIGINS = [
    f"{BASE_URL}",
    f"{BASE_URL}:3000",  # caso deploy local use porta 3000
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://plannerrun.com",
    "https://www.plannerrun.com",
]
CORS(app, resources={r"/api/*": {"origins": FRONT_ORIGINS}}, supports_credentials=True)

# ---------------------------------------------------------------------------
# 🔧 3. Helpers
# ---------------------------------------------------------------------------

def get_db_connection():
    """Abre conexão imediata com timeout curto."""
    try:
        return psycopg2.connect(**DB_SETTINGS, connect_timeout=5)
    except psycopg2.Error as exc:
        app.logger.exception("Falha ao conectar ao Postgres: %s", exc)
        raise


def send_email(recipient: str, subject: str, body: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = recipient
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
            app.logger.info("E‑mail enviado para %s", recipient)
    except Exception:
        app.logger.exception("Erro ao enviar e‑mail para %s", recipient)


# ---------------------------------------------------------------------------
# 🔧 4. Endpoints API
# ---------------------------------------------------------------------------

@app.route("/api/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data: Dict[str, Any] = request.get_json(force=True)  # Falha se corpo inválido
    meses = int(data.get("mesesAcompanhamento", 0))

    price_id = PRICE_IDS.get(meses)
    if not price_id:
        return jsonify({"error": "mesesAcompanhamento inválido"}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="payment",
            success_url=f"{BASE_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{BASE_URL}/cancel",
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
    except Exception as exc:
        app.logger.exception("Stripe checkout error: %s", exc)
        return jsonify({"error": str(exc)}), 500


@app.route("/api/payment-details", methods=["GET"])
def payment_details():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id obrigatório"}), 400

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        meta = session.get("metadata", {})

        with get_db_connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO clientes (altura,peso,idade,objetivo,dias,meses,nivel,email)
                VALUES (%(altura)s,%(peso)s,%(idade)s,%(objetivo)s,%(dias)s,%(meses)s,%(nivel)s,%(email)s)
                RETURNING id
                """,
                meta,
            )
            user_id = cur.fetchone()[0]
            conn.commit()

        send_email(
            meta["email"],
            "Confirmação de Pagamento - PlannerRun",
            f"Obrigado pelo pagamento! ID interno: {user_id}.",
        )
        return jsonify({"user_id": user_id, **meta})

    except Exception as exc:
        app.logger.exception("payment-details erro: %s", exc)
        return jsonify({"error": str(exc)}), 500


@app.route("/api/clientes-count")
def clientes_count():
    try:
        with get_db_connection() as conn, conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM clientes")
            return jsonify({"count": cur.fetchone()[0]})
    except Exception as exc:
        app.logger.exception("Erro ao contar clientes: %s", exc)
        return jsonify({"error": str(exc)}), 500


# ---------------------------------------------------------------------------
# 🔧 5. Execução local --------------------------------------------------------
# (em produção, use gunicorn + gevent/uvicorn etc.)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    app.run(host="0.0.0.0", port=5000, debug=True)
