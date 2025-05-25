"use client"
import Image from "next/image"
import { Button } from "@/components/Button"
import { CheckCircle, ArrowRight, Award, TrendingUp, ShieldCheck, Mail, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Inter } from "next/font/google"
import React from "react" // Import React
import { useState, useEffect } from "react"

const CountdownTimer = () => {
  // Define a data alvo: 21/03/2025 às 00:00
  const targetDate = new Date("2025-05-23T00:00:00")

  // Estado inicial com valores zero para evitar hidratação incorreta
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [buyers, setBuyers] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const maxBuyers = 100

  // Função para calcular o tempo restante
  const calculateTimeLeft = () => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  // Primeiro useEffect para marcar que estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Segundo useEffect para atualizar o timer apenas no cliente
  useEffect(() => {
    if (isClient) {
      // Atualiza imediatamente na primeira renderização do cliente
      setTimeLeft(calculateTimeLeft())

      // Configura o intervalo para atualizações subsequentes
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft())
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isClient])

  // Terceiro useEffect para buscar dados apenas no cliente
  useEffect(() => {
    if (isClient) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"
  
      fetch(`${API_URL}/clientes-count`)
        .then((response) => response.json())
        .then((data) => {
          if (data.count !== undefined) {
            setBuyers(data.count)
          }
        })
        .catch((error) => console.error("Erro ao buscar a contagem de clientes", error))
    }
  }, [isClient])


  // Calcula vagas restantes
  const remainingSpots = maxBuyers - buyers

  // Se não estiver no cliente, renderiza um esqueleto de carregamento
  if (!isClient) {
    return (
      <div className="text-center animate-pulse">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-blue-800 p-2 md:p-3 rounded-lg w-16 md:w-20">
              <div className="h-6 md:h-8 bg-blue-700 rounded mb-1"></div>
              <div className="h-3 md:h-4 bg-blue-700 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="h-4 bg-gray-300 rounded-full"></div>
          <div className="h-6 bg-gray-300 rounded mt-2 w-3/4 mx-auto"></div>
        </div>
      </div>
    )
  }

  // Renderização normal quando estiver no cliente
  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
        <div className="bg-blue-900 p-2 md:p-3 rounded-lg w-16 md:w-20">
          <div className="text-xl md:text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">Dias</div>
        </div>
        <div className="bg-blue-900 p-2 md:p-3 rounded-lg w-16 md:w-20">
          <div className="text-xl md:text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Horas</div>
        </div>
        <div className="bg-blue-900 p-2 md:p-3 rounded-lg w-16 md:w-20">
          <div className="text-xl md:text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Minutos</div>
        </div>
        <div className="bg-blue-900 p-2 md:p-3 rounded-lg w-16 md:w-20">
          <div className="text-xl md:text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Segundos</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${(buyers / maxBuyers) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-yellow-300 font-bold">
          Apenas {remainingSpots} vagas restantes! Já temos {buyers} compradores.
        </p>
      </div>
    </div>
  )
}

const inter = Inter({ subsets: ["latin"] })

export default function LandingPage() {
  const router = useRouter()
  const [showMessage, setShowMessage] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setShowMessage(true)
    }, 1000)
  }, [])

  const scrollToapelativo = () => {
    const apelativoSection = document.getElementById("apelativo-section")
    apelativoSection?.scrollIntoView({ behavior: "smooth" })
  }

  const handleRedirect = () => {
    const pricingSection = document.getElementById("pricing-section")
    pricingSection?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePlanSelection = (meses: number) => {
    // Armazena a escolha no sessionStorage
    sessionStorage.setItem("mesesSelecionados", meses.toString())

    // Redireciona para a página de guia
    router.push("/guia")
  }

  return (
    <div className={`flex flex-col min-h-screen ${inter.className} overflow-x-hidden`}>
      <main>
        <section className="relative h-screen">
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://media.giphy.com/media/1k1Z46tjQWIAlcXYt6/giphy.gif"
              alt="Marathon Runners"
              fill
              className="object-cover"
              unoptimized // Since we're using an external GIF
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className={`text-white text-center transition-opacity duration-1000 ${showMessage ? "opacity-100" : "opacity-0"} px-4`}
            >
              <h1 className="text-3xl md:text-6xl font-bold mb-4">PlannerRun</h1>
              <p className="text-lg md:text-2xl mb-8">Treinamentos Personalizados Criados com Dados de Atletas</p>
              <Button
                variant="default1"
                size="lg"
                onClick={scrollToapelativo}
                className="text-base md:text-lg px-6 py-3 md:px-8 md:py-4"
              >
                Comece Sua Jornada <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>
          </div>
        </section>

        {/* Nova seção apelativa no lugar de "Quem somos" */}
        <section id="apelativo-section" className="py-12 md:py-20 bg-gradient-to-r from-blue-300 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-red-600">
                🚨 VOCÊ NÃO PRECISA PAGAR UMA FORTUNA 🚨 PARA TER UM TREINO EFICIENTE!
              </h2>

              <div className="bg-white p-4 md:p-8 rounded-xl shadow-xl mb-10">
                <div className="space-y-4 mb-6 md:mb-8">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-red-600 text-xl md:text-2xl font-bold flex-shrink-0">❌</span>
                    <p className="text-base md:text-lg text-gray-800">
                      Consultorias esportivas cobram absurdos por treinos que poderiam ser acessíveis.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-red-600 text-xl md:text-2xl font-bold flex-shrink-0">❌</span>
                    <p className="text-base md:text-lg text-gray-800">
                      Planos prontos na internet não respeitam seu nível e só te fazem perder tempo.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-red-600 text-xl md:text-2xl font-bold flex-shrink-0">❌</span>
                    <p className="text-base md:text-lg text-gray-800">
                      Você sente que está estagnado e não sabe como evoluir com segurança?
                    </p>
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-bold text-center my-6 md:my-8 text-blue-600">
                  🔥 CHEGOU A PLANNERRUN – O TREINAMENTO QUE 🔥 REALMENTE FUNCIONA PARA VOCÊ!
                </h3>

                <div className="flex items-start gap-2 md:gap-3 mb-6">
                  <span className="text-blue-600 text-xl md:text-2xl font-bold flex-shrink-0">💡</span>
                  <p className="text-base md:text-lg text-gray-800">
                    Geramos um plano de treinamento totalmente personalizado em segundos! Sem mensalidades abusivas, sem
                    treinos genéricos. Nosso sistema usa métodos cientificamente comprovados para criar um treino sob
                    medida para você, respeitando seu nível, sua rotina e seu corpo – garantindo evolução e evitando
                    lesões.
                  </p>
                </div>

                <div className="space-y-4 mb-6 md:mb-8">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-green-600 text-xl md:text-2xl font-bold flex-shrink-0">✅</span>
                    <p className="text-base md:text-lg text-gray-800">Sem pagar caro para ter um treino de verdade</p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-green-600 text-xl md:text-2xl font-bold flex-shrink-0">✅</span>
                    <p className="text-base md:text-lg text-gray-800">
                      Treinamento específico para seu corpo e objetivo – sem riscos desnecessários
                    </p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-green-600 text-xl md:text-2xl font-bold flex-shrink-0">✅</span>
                    <p className="text-base md:text-lg text-gray-800">Evolução contínua e segura – sem achismos</p>
                  </div>
                </div>

                <div className="text-center mt-6 md:mt-8">
                  <p className="text-lg md:text-xl font-bold text-blue-700 mb-4 md:mb-6">
                    ⚡ Pare de gastar dinheiro com consultorias caras! Receba seu plano completo agora e comece a correr
                    do jeito certo!
                  </p>
                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleRedirect}
                      className="text-base md:text-lg px-4 py-3 md:px-8 md:py-4 w-auto max-w-full break-words"
                    >
                      <span className="flex items-center flex-wrap justify-center">
                        QUERO MEU PLANO PERSONALIZADO
                        <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que oferecemos Section */}
        <section className="py-12 md:py-20 bg-gray-200">
          <div className="container mx-auto px-4 md:px-6 lg:px-12">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gray-900">
              O que oferecemos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative">
                <Image
                  src="/images/Planilha.png"
                  alt="Plano de Treino Personalizado"
                  width={550}
                  height={350}
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 mx-auto"
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Planos de Treino Personalizados</h3>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Nossa inteligência artificial analisa seu perfil, objetivos e histórico para criar um plano de
                  treinamento <b>exclusivo</b>. Utilizamos uma abordagem baseada em dados, levando em conta:
                </p>
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-start gap-2 md:gap-3">
                    <Award className="text-blue-600 h-6 w-6 md:h-8 md:w-8 flex-shrink-0 animate-pulse" />
                    <span className="text-base md:text-lg text-gray-700">
                      Seu nível atual de condicionamento físico
                    </span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <TrendingUp className="text-green-600 h-6 w-6 md:h-8 md:w-8 flex-shrink-0 animate-pulse" />
                    <span className="text-base md:text-lg text-gray-700">
                      Seus objetivos específicos de tempo e distância
                    </span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <Clock className="text-purple-600 h-6 w-6 md:h-8 md:w-8 flex-shrink-0 animate-spin" />
                    <span className="text-base md:text-lg text-gray-700">
                      Sua disponibilidade de tempo para treinos
                    </span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <CheckCircle className="text-orange-500 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                    <span className="text-base md:text-lg text-gray-700">Histórico de lesões e limitações físicas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-10 md:py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">Por que escolher a PlannerRun?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Plano 100% sob medida para você!",
                  description:
                    "Nada de fórmulas prontas. Planos de treinamento adaptados ao seu perfil usando estratégias modernas.",
                },
                {
                  title: "Progressão Inteligente",
                  description: "Progrida como um atleta de alto nível, sem lesões.",
                },
                {
                  title: "Aprenda com os melhores",
                  description: "Beneficie-se de técnicas testadas por campeões.",
                },
              ].map((benefit, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                  <CheckCircle className="text-green-500 mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* YouTube Videos Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
              Veja como outros corredores estão melhorando seu desempenho
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                "https://www.youtube.com/shorts/vipdva3TJCM",
                "https://www.youtube.com/shorts/DpF45oM_CbQ",
                "https://www.youtube.com/shorts/CMe63_yuDEw",
              ].map((videoUrl, index) => (
                <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md aspect-video">
                  <iframe
                    src={videoUrl.replace("youtube.com/shorts/", "youtube.com/embed/")}
                    title={`Depoimento de corredor ${index + 1}`}
                    className="w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing-section" className="py-10 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Quanto vale o seu progresso?</h2>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:p-6 rounded-xl shadow-lg mb-8 md:mb-10 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-center">🎁 OFERTA ESPECIAL LIMITADA! 🎁</h3>
              <p className="text-base md:text-lg text-center mb-4">
                Para os <span className="font-bold text-yellow-300">100 primeiros compradores</span>, iremos sortear
                <span className="font-bold text-yellow-300"> 3 Galaxy Fit 3</span> para monitorar seus treinos!
              </p>

              <CountdownTimer />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
              {[
                { price: 39.9, months: 4, tier: "Basic" },
                { price: 49.9, months: 5, tier: "Intermediary" },
                { price: 56.9, months: 6, tier: "Advanced" },
              ].map((plan, index) => {
                // Cálculo correto do preço por dia
                const dailyCost = (plan.price / (plan.months * 30)).toFixed(2)

                return (
                  <div
                    key={index}
                    className="bg-white p-6 md:p-8 rounded-lg shadow-md text-center flex flex-col flex-1 relative overflow-hidden"
                  >
                    {/* Ajuste do rótulo de preço por dia para não ficar cortado */}
                    <div className="absolute top-3 right-3 bg-blue-500 text-white py-1 px-2 md:px-3 rounded-lg text-xs md:text-sm shadow-md">
                      R$ {dailyCost}/dia
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{plan.tier}</h3>
                    <p className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">R$ {plan.price.toFixed(2)}</p>
                    <p className="text-lg md:text-xl mb-3 md:mb-4">
                      Plano de <span className="font-bold text-blue-600">{plan.months} meses</span>
                    </p>
                    <ul className="mb-6 md:mb-8 flex-grow text-left">
                      <li className="mb-2 flex items-center">
                        <CheckCircle className="text-green-500 mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="text-sm md:text-base">Treinos adaptados ao seu perfil</span>
                      </li>
                      <li className="mb-2 flex items-center">
                        <CheckCircle className="text-green-500 mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="text-sm md:text-base">Estratégias de treino baseadas em dados reais</span>
                      </li>
                      <li className="mb-2 flex items-center">
                        <CheckCircle className="text-green-500 mr-2 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                        <span className="text-sm md:text-base">Suporte prioritário para dúvidas e orientações</span>
                      </li>
                    </ul>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePlanSelection(plan.months)}
                      className="w-full"
                    >
                      Comece Agora <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                )
              })}
            </div>
            <p className="text-center mt-6 md:mt-8 text-gray-600">
              Não perca tempo! Escolha o período que melhor se adapta aos seus objetivos e comece a treinar como um
              atleta hoje mesmo.
            </p>
          </div>
        </section>

        {/* Quem somos nós Section - Movida para depois da seção de preços */}
        <section id="quem-somos" className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            {/* Título principal com destaque */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              Quem Somos?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Imagem representando a equipe */}
              <div className="flex justify-center">
                <Image
                  src="/images/im1-removebg-preview.png"
                  alt="Equipe PlannerRun"
                  width={400}
                  height={280}
                  className="rounded-lg shadow-lg max-w-full"
                />
              </div>

              {/* Texto com ícones */}
              <div>
                <h3 className="text-xl md:text-2xl font-semibold flex items-center mb-3 md:mb-4">
                  <Award className="text-yellow-500 mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  PlannerRun: A Revolução dos Treinos de Corrida Personalizados
                </h3>
                <p className="text-gray-700 mb-4 md:mb-6">
                  A <span className="font-semibold text-blue-600">PlannerRun</span> nasceu da paixão pela corrida e da
                  necessidade de treinos realmente personalizados. Diferente dos métodos tradicionais, utilizamos
                  inteligência artificial treinada com milhares de dados de corredores profissionais para criar treinos
                  exclusivos.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold flex items-center mb-3 md:mb-4">
                  <TrendingUp className="text-green-500 mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  Tecnologia e Ciência no Seu Treinamento
                </h3>
                <p className="text-gray-700 mb-4 md:mb-6">
                  Combinamos{" "}
                  <span className="font-semibold text-blue-600">ciência esportiva, aprendizado de máquina</span> e
                  análise de performance para gerar treinos otimizados, levando em conta nível de condicionamento, tempo
                  disponível e objetivos individuais.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold flex items-center mb-3 md:mb-4">
                  <ShieldCheck className="text-blue-500 mr-2 md:mr-3 h-6 w-6 md:h-8 md:w-8 flex-shrink-0" />
                  Evolução e Segurança no seu Ritmo
                </h3>
                <p className="text-gray-700">
                  Nossa IA aprende e evolui com o seu desempenho, garantindo que cada fase do treinamento seja eficiente
                  e segura.
                  <span className="font-semibold text-blue-600">
                    {" "}
                    Corra no seu melhor ritmo e atinja seus objetivos!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12">
              Tem perguntas? Nós temos as respostas.
            </h2>
            <p className="text-base md:text-lg text-gray-700 text-center mb-8 md:mb-12">
              Se sua pergunta não estiver aqui, fale com a gente. Queremos que você treine com total confiança!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  question: "Como a IA cria um plano personalizado para mim?",
                  answer:
                    "Nossa IA estuda o treinamento de milhares de atletas de e ajusta cada detalhe para você. Seu plano será único, respeitando seu ritmo e objetivos, sempre com base em estratégias comprovadas.",
                },
                {
                  question: "Nunca fiz um treino estruturado. Esse plano é para mim?",
                  answer:
                    "Com certeza! Nossa IA ajusta tudo ao seu nível atual, seja você um iniciante ou um corredor experiente. Você evolui no seu ritmo, sem exageros e sem risco de lesões.",
                },
                {
                  question: "Em quanto tempo verei resultados?",
                  answer:
                    "A maioria dos corredores percebe evolução em média de 4 a 6 semanas. Alguns já batem seus recordes pessoais antes mesmo de completar 3 meses!",
                },
                {
                  question: "Vale o investimento?",
                  answer:
                    "Quanto vale ter um plano que otimiza seu tempo e evita lesões? Por menos que um café por dia, você recebe um treinador virtual de ponta e acelera sua evolução.",
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section - Call to action mais persuasivo */}
        <section className="py-12 md:py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Sua História de Campeão Começa Hoje</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8">
              Não espere mais para descobrir o que milhares de corredores já sabem: com a PlannerRun, você está a um
              passo de se tornar um campeão.
              <br />
              <strong>Comece hoje e veja a diferença em semanas.</strong>
            </p>
            <Button
              variant="default1"
              size="lg"
              onClick={handleRedirect}
              className="text-base md:text-lg px-6 py-3 md:px-8 md:py-4"
            >
              Comece seu treino de elite <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-700 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Image
              src="/images/im1-removebg-preview.png"
              alt="PlannerRun Logo"
              width={100}
              height={60}
              className="mb-0"
            />
            <div className="flex items-center">
              <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <a href="mailto:plannerrun@gmail.com" className="hover:text-blue-400">
                plannerrun@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

