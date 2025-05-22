"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { ArrowRight, Star, Shield, Trophy, Clock, CheckCircle, Users, Gift } from "lucide-react"
import { Button } from "@/components/Button"
import Image from "next/image"

const Testimonial = ({
  name,
  achievement,
  quote,
  image,
}: { name: string; achievement: string; quote: string; image: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center mb-4">
      <Image src={image || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded-full" />
      <div className="ml-4">
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-blue-600 text-sm">{achievement}</p>
      </div>
    </div>
    <p className="text-gray-600 italic">&ldquo;{quote}&rdquo;</p>
  </div>
)

const Step = ({
  number,
  title,
  description,
  image,
  benefits,
}: {
  number: number
  title: string
  description: React.ReactNode
  image?: string
  benefits?: string[]
}) => (
  <div className="flex flex-col items-center w-full max-w-sm mx-auto md:mx-4 mb-8 bg-white rounded-xl p-4 md:p-6 shadow-lg transform hover:-translate-y-1 transition-all duration-300">
    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-center text-blue-800">{title}</h3>
    {image && (
      <div className="mb-4 w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={`Exemplo de ${title}`}
          width={300}
          height={200}
          className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 mx-auto"
        />
      </div>
    )}
    <div className="text-center text-gray-600 w-full">{description}</div>
    {benefits && (
      <ul className="mt-4 space-y-2 w-full">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="text-green-500 w-5 h-5 mr-2 flex-shrink-0 mt-1" />
            <span className="text-sm text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default function FormGuide() {
  const router = useRouter()

  const handleGoToForm = () => {
    router.push("/cadastro")
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Seu Plano de Treino Personalizado em 6 Passos Simples
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Em poucos minutos, você terá acesso a um plano de treino profissional adaptado ao seu perfil e
            objetivos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
              <Users className="text-blue-500 w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="text-sm md:text-base text-gray-700">+2.500 corredores</span>
            </div>
            <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
              <Star className="text-yellow-400 w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="text-sm md:text-base text-gray-700">4.8/5 de satisfação</span>
            </div>
            <div className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm">
              <Shield className="text-green-500 w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
              <span className="text-sm md:text-base text-gray-700">7 dias de garantia</span>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-3 md:p-4 rounded-lg inline-block mb-8 max-w-full">
            <Gift className="inline-block w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 animate-bounce" />
            <span className="font-semibold text-sm md:text-base">
              Oferta Especial: 3 Galaxy Fit 3 serão sorteados entre os 100 primeiros compradores!
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-start mb-16">
          <Step
            number={1}
            title="Preencha Suas Informações Básicas"
            description="Forneça sua idade, peso e altura para um plano adaptado à sua condição física atual."
            image="/images/dados.png"
            benefits={[
              "Cálculo preciso da intensidade ideal dos treinos",
              "Adaptação personalizada das distâncias",
              "Prevenção de lesões através de progressão adequada",
            ]}
          />

          <div className="hidden md:flex items-center justify-center w-8 h-8 mt-8">
            <ArrowRight className="text-blue-500 w-8 h-8" />
          </div>

          <Step
            number={2}
            title="Selecione Seu Nível Atual"
            description="Escolha o nível que melhor representa sua experiência com corrida."
            image="/images/nivel.png"
            benefits={[
              "Treinos adequados ao seu nível de experiência",
              "Progressão segura e eficiente",
              "Desafios na medida certa",
            ]}
          />

          <div className="hidden md:flex items-center justify-center w-8 h-8 mt-8">
            <ArrowRight className="text-blue-500 w-8 h-8" />
          </div>

          <Step
            number={3}
            title="Detalhe Seu Objetivo"
            description={
              <div>
                <p className="mb-4">
                  Quanto mais detalhes você fornecer sobre seus objetivos, melhor será seu plano personalizado.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <p className="font-semibold text-blue-800 mb-2">Exemplo de objetivo bem detalhado:</p>
                  <p className="text-sm text-gray-700">
                    &ldquo;Quero completar minha primeira meia maratona em 6 meses. Atualmente corro 10km em 1h05min,
                    treino 3x por semana. Preciso melhorar minha resistência e tenho dificuldade com respiração em
                    ritmos mais intensos.&rdquo;
                  </p>
                </div>
              </div>
            }
            image="/images/objetivo.png"
            benefits={[
              "Plano 100% focado no seu objetivo",
              "Metas intermediárias realistas",
              "Adaptação contínua do treino",
            ]}
          />
        </div>

        <div className="flex flex-wrap justify-center items-start">
          <Step
            number={4}
            title="Escolha Seu Plano"
            description="Selecione o plano que melhor se adapta aos seus objetivos, com garantia de satisfação."
            image="/images/pagamento.png"
            benefits={["Pagamento 100% seguro", "Garantia de 7 dias", "Suporte prioritário"]}
          />

          <div className="hidden md:flex items-center justify-center w-8 h-8 mt-8">
            <ArrowRight className="text-blue-500 w-8 h-8" />
          </div>

          <Step
            number={5}
            title="Receba a Confirmação"
            description="Após o pagamento, você receberá um email com a confirmação e seus dados cadastrados."
            image="/images/confirmacao.png"
            benefits={[
              "Confirmação instantânea",
              "Revisão dos dados cadastrados",
              "Instruções detalhadas do próximo passo",
            ]}
          />

          <div className="hidden md:flex items-center justify-center w-8 h-8 mt-8">
            <ArrowRight className="text-blue-500 w-8 h-8" />
          </div>

          <Step
            number={6}
            title="Seu Plano Personalizado"
            description="Em poucos minutos, receba seu plano de treino completo e comece sua jornada."
            image="/images/Planilha.png"
            benefits={[
              "Plano detalhado semana a semana",
              "Instruções claras para cada treino",
              "Progressão científica e segura",
            ]}
          />
        </div>

        <div className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">O Que Nossos Corredores Dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Testimonial
              name="Carlos Silva"
              achievement="Completou sua primeira meia maratona"
              quote="O plano personalizado foi fundamental para minha evolução. Em 6 meses, saí do zero até completar 21km, minha primeira meia maratona. Estou muito contente com o resultado!"
              image="/images/pexels-mvdheuvel-2284163.jpg"
            />
            <Testimonial
              name="Ana Paula"
              achievement="Melhorou 8min nos 10km"
              quote="Nunca pensei que conseguiria correr tão rápido. O plano respeitou meus limites e me fez evoluir constantemente."
              image="/images/pexels-runffwpu-1571939.jpg"
            />
            <Testimonial
              name="Roberto Santos"
              achievement="Perdeu 12kg com o treino"
              quote="Além da evolução na corrida, o plano me ajudou a transformar meu corpo e minha saúde. Sensacional!"
              image="/images/pexels-runffwpu-1578384.jpg"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-12 text-white text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Comece Sua Transformação Hoje</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Junte-se a milhares de corredores que já transformaram seus treinos com a PlannerRun. Seu plano
            personalizado está a apenas alguns cliques de distância.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <span>Pronto em poucos minutos</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <span>7 dias de garantia</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <span>Resultados comprovados</span>
            </div>
          </div>
          <Button
            onClick={handleGoToForm}
            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 w-auto"
          >
            Criar Meu Plano Personalizado
            <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <p className="mt-4 text-sm opacity-75">Comece agora e receba seu plano em poucos minutos</p>
        </div>
      </div>
    </div>
  )
}

