"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const API_URL = "/api";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tenta obter o session_id (Stripe)
  const sessionId = searchParams.get("session_id");
  // Tenta obter o external_reference (MercadoPago)
  const externalReference = searchParams.get("external_reference");

  interface PaymentData {
    email: string;
    altura: number;
    peso: number;
    idade: number;
    objetivo: string;
    dias: number;
    meses: number;
    nivel: string;
  }

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se tiver session_id, assume fluxo do Stripe
    if (sessionId) {
      axios
        .get(`${API_URL}/payment-details?session_id=${sessionId}`, {
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost:5000",
          },
        })
        .then((response) => {
          setPaymentData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar detalhes do pagamento:", error);
          setLoading(false);
        });
    }
    // Se não tiver session_id, mas tiver external_reference, assume fluxo do MercadoPago
    else if (externalReference) {
      axios
        .get(`${API_URL}/payment-details-mercadopago?external_reference=${externalReference}&collection_status=approved`, {
          headers: { "Content-Type": "application/json" },
        })
        .then(response => {
          setPaymentData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar detalhes do pagamento (MercadoPago):", error);
          setLoading(false);
        });
    }
     else {
      // Se nenhum parâmetro esperado for encontrado, encerra o carregamento
      setLoading(false);
    }
  }, [sessionId, externalReference]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center max-w-lg">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Compra Concluída!</h1>

        {loading ? (
          <p className="mt-2 text-lg">Carregando informações...</p>
        ) : paymentData ? (
          <>
            <p className="mt-2 text-lg">
              Obrigado por adquirir com a PlannerRun! Sua planilha será enviada para o email cadastrado assim que um dos nossos profissionais analisar se os dados estão corretos.
            </p>
            <div className="bg-white p-4 mt-4 rounded-lg text-gray-800 text-left">
              <h2 className="text-lg font-semibold mb-2">Seus dados cadastrados:</h2>
              <ul className="text-sm">
                <li>
                  <strong>Email:</strong> {paymentData.email}
                </li>
                <li>
                  <strong>Altura:</strong> {paymentData.altura} cm
                </li>
                <li>
                  <strong>Peso:</strong> {paymentData.peso} kg
                </li>
                <li>
                  <strong>Idade:</strong> {paymentData.idade} anos
                </li>
                <li>
                  <strong>Objetivo:</strong> {paymentData.objetivo}
                </li>
                <li>
                  <strong>Dias disponíveis:</strong> {paymentData.dias} dias/semana
                </li>
                <li>
                  <strong>Meses de acompanhamento:</strong> {paymentData.meses} meses
                </li>
                <li>
                  <strong>Nível:</strong> {paymentData.nivel}
                </li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-red-400">Erro ao carregar os dados do pagamento.</p>
        )}

        <p className="mt-2">
          Caso tenha alguma dúvida, entre em contato conosco pelo email: <strong>plannerrun@gmail.com</strong>
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-white text-center">Carregando...</p>}>
      <SuccessPageContent />
    </Suspense>
  );
}
