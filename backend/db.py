import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()


# Função para conectar ao PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),  
        password=os.getenv("DB_PASSWORD")  
    )
    return conn

def get_oldest_pending_purchase():
    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT * FROM clientes
        WHERE status != 'concluido'
        ORDER BY data_pagamento ASC
        LIMIT 1;
    """
    cursor.execute(query)
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    return result


def update_purchase_status(purchase_id, status="concluido"):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "UPDATE clientes SET status = %s WHERE id = %s;"
    cursor.execute(query, (status, purchase_id))
    conn.commit()
    cursor.close()
    conn.close()

