"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Info, Mail, Ruler, Weight, Calendar, Users, Star, Target, CheckCircle, ArrowRight, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api" 

const nivelDescricoes = {
  Iniciante: "Você começou a correr há menos de 6 meses, corre até 5km ou está começando agora",
  Intermediário: "Você corre regularmente há mais de 6 meses, completa 5-10km com facilidade",
  Avançado: "Você treina há mais de 1 ano, participa de competições, corre mais de 10km regularmente",
}

const formSchema = z.object({
  altura: z
    .number({
      required_error: "A altura é obrigatória",
      invalid_type_error: "A altura deve ser um número",
    })
    .min(100, "A altura deve ser no mínimo 100 cm")
    .max(250, "A altura deve ser no máximo 250 cm"),

  peso: z
    .number({
      required_error: "O peso é obrigatório",
      invalid_type_error: "O peso deve ser um número",
    })
    .min(30, "O peso deve ser no mínimo 30 kg")
    .max(300, "O peso deve ser no máximo 300 kg"),

  idade: z
    .number({
      required_error: "A idade é obrigatória",
      invalid_type_error: "A idade deve ser um número",
    })
    .min(18, "A idade deve ser no mínimo 18 anos")
    .max(100, "A idade deve ser no máximo 100 anos"),

  objetivo: z
    .string({
      required_error: "O objetivo é obrigatório",
    })
    .min(10, "O objetivo deve ter no mínimo 10 caracteres")
    .max(500, "O objetivo deve ter no máximo 500 caracteres"),

  diasDisponiveis: z
    .number({
      required_error: "Os dias disponíveis são obrigatórios",
      invalid_type_error: "Os dias disponíveis devem ser um número",
    })
    .min(1, "Deve haver no mínimo 1 dia disponível")
    .max(5, "Deve haver no máximo 5 dias disponíveis"),

  mesesAcompanhamento: z
    .number({
      required_error: "Os meses de acompanhamento são obrigatórios",
      invalid_type_error: "Os meses de acompanhamento devem ser um número",
    })
    .refine((val) => [3, 4, 5, 6].includes(val), {
      message: "Selecione um plano de 3 ou 6 meses",
    }),

  nivelAtual: z
    .string({
      required_error: "O nível atual é obrigatório",
      invalid_type_error: "O nível atual é obrigatório",
    })
    .refine((val) => ["Iniciante", "Intermediário", "Avançado"].includes(val), {
      message: "Selecione um nível válido",
    }),

  email: z
    .string({
      required_error: "O email é obrigatório",
    })
    .email("Digite um email válido"),
})

type FormValues = z.infer<typeof formSchema>

const FormField = ({
  label,
  children,
  error,
  icon: Icon,
  tooltip,
}: {
  label: string
  children: React.ReactNode
  error?: string
  icon: React.ElementType
  tooltip?: string
}) => (
  <div className="relative mb-3">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="text-blue-500" size={20} />
      <label className="text-gray-700 font-medium">
        {label}
        {tooltip && (
          <span className="ml-2 relative group">
            <Info className="inline-block cursor-pointer text-blue-500" size={18} />
            <span className="absolute left-70 bottom-70 mb-2 hidden group-hover:block bg-white text-sm text-gray-800 rounded-lg p-2 shadow-lg w-64 z-50">
              {tooltip.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < tooltip.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </span>
        )}
      </label>
    </div>
    {children}
    {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
  </div>
)

function FormularioTreinamento() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const mesesSelecionados = sessionStorage.getItem("mesesSelecionados")
    if (mesesSelecionados) {
      setValue("mesesAcompanhamento", Number.parseInt(mesesSelecionados, 10))
    }
  }, [setValue])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar a sessão de pagamento.")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Erro ao redirecionar para o Mercado Pago:", error)
      setMessage({
        type: "error",
        text: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-indigo-900 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-7xl overflow-hidden rounded-3xl md:min-h-[800px] h-full relative shadow-xl">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
            <img
              src="/images/Planilha.png"
              alt="Runner in action"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center 20%",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-black bg-opacity-85" />
            <div className="absolute bottom-14 left-8 right-8 text-white text-center z-10">
              <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block mb-4">
                Tecnologia a seu Favor
              </p>
              <p className="text-base">Utilizamos inteligência artificial para montar o melhor treino para você.</p>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-[#f8f8ff] p-4 md:p-8 flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
              Crie seu Plano de Treino Personalizado em Minutos
            </h1>

            <div className="bg-blue-50 p-3 rounded-xl mb-4 border-l-4 border-blue-500">
              <h2 className="text-lg font-semibold text-blue-700 mb-1">Benefícios do seu plano personalizado:</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Treinos adaptados ao seu nível</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Progressão segura sem lesões</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Baseado em dados de atletas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Resultados em semanas</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <FormField label="Email" error={errors.email?.message} icon={Mail}>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu email"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Idade" error={errors.idade?.message} icon={Calendar}>
                  <input
                    type="number"
                    {...register("idade", { valueAsNumber: true })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sua idade"
                  />
                </FormField>

                <FormField
                  label="Nível atual"
                  error={errors.nivelAtual?.message}
                  icon={Star}
                  tooltip={`Iniciante: ${nivelDescricoes.Iniciante}\n\nIntermediário: ${nivelDescricoes.Intermediário}\n\nAvançado: ${nivelDescricoes.Avançado}`}
                >
                  <select
                    {...register("nivelAtual")}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione seu nível</option>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Altura (cm)" error={errors.altura?.message} icon={Ruler}>
                  <input
                    type="number"
                    {...register("altura", { valueAsNumber: true })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sua altura em cm"
                  />
                </FormField>

                <FormField label="Peso (kg)" error={errors.peso?.message} icon={Weight}>
                  <input
                    type="number"
                    {...register("peso", { valueAsNumber: true })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu peso em kg"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label="Dias disponíveis por semana" error={errors.diasDisponiveis?.message} icon={Users}>
                  <select
                    {...register("diasDisponiveis", { valueAsNumber: true })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione os dias</option>
                    {[1, 2, 3, 4, 5].map((day) => (
                      <option key={day} value={day}>
                        {day} {day === 1 ? "dia" : "dias"}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div>
                <FormField
                  label="Objetivo"
                  error={errors.objetivo?.message}
                  icon={Target}
                  tooltip={`Descreva seu objetivo de corrida em detalhes. Informe também seu progresso com as corridas.

    Por exemplo:
    - "Quero melhorar minha resistência para completar uma meia maratona. Hoje em dia já consigo correr 15km com uma leve dificuldade."  
    - "Desejo apenas melhorar minha performance."`}
                >
                  <textarea
                    {...register("objetivo")}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] max-h-[120px]"
                    rows={3}
                    placeholder="Descreva seu objetivo com o treinamento"
                  />
                </FormField>
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-base md:text-lg transition-all hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transform hover:-translate-y-1 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Gerando seu plano...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Gerar Meu Plano de Treinamento Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center text-center">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-center mb-1">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <p>Garantia de satisfação ou seu dinheiro de volta em até 7 dias.</p>
                  <p className="mt-1">Seus dados estão seguros e protegidos.</p>
                </div>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-400"
                      : "bg-red-100 text-red-700 border border-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function Home() {
  return <FormularioTreinamento />
}

