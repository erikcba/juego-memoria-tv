"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, Star, Medal, Crown, Sparkles } from "lucide-react"
import Image from "next/image"

// Definir el contenido para las tarjetas
const CARD_CONTENT = [
  { id: "logo", text: "LOGO CLUB VEA", isLogo: true },
  { id: "sirah", text: "SIRAH", isLogo: false },
  { id: "cabernet", text: "CABERNET", isLogo: false },
  { id: "malbec", text: "MALBEC", isLogo: false },
]

// Crear un array con pares de contenido
const createCards = () => {
  const pairs = [...CARD_CONTENT, ...CARD_CONTENT]
  return pairs
    .map((content, index) => ({
      id: index,
      content,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5) // Mezclar las tarjetas
}

export default function MemoryGame() {
  const [cards, setCards] = useState(createCards())
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [isGameComplete, setIsGameComplete] = useState(false)
  const [isNewBestScore, setIsNewBestScore] = useState(false)

  // Cargar el mejor puntaje desde localStorage al iniciar
  useEffect(() => {
    const savedBestScore = localStorage.getItem("memoryGameBestScore")
    if (savedBestScore) {
      setBestScore(Number.parseInt(savedBestScore))
    }
  }, [])

  // Comprobar si el juego ha terminado
  useEffect(() => {
    if (cards.every((card) => card.isMatched) && !isGameComplete) {
      // Añadir un bono por completar el juego (menos movimientos = mayor bono)
      const completionBonus = Math.max(50 - moves * 2, 10)
      const finalScore = score + completionBonus

      // Actualizar el puntaje final
      setScore(finalScore)
      setIsGameComplete(true)

      // Comprobar si es un nuevo mejor puntaje
      if (finalScore > bestScore) {
        setBestScore(finalScore)
        localStorage.setItem("memoryGameBestScore", finalScore.toString())
        setIsNewBestScore(true)
      }
    }
  }, [cards, moves, score, bestScore, isGameComplete])

  // Manejar el clic en una tarjeta
  const handleCardClick = (index: number) => {
    // No hacer nada si la tarjeta ya está volteada o emparejada
    if (cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) {
      return
    }

    // Voltear la tarjeta
    const updatedCards = [...cards]
    updatedCards[index].isFlipped = true
    setCards(updatedCards)

    // Añadir la tarjeta a las volteadas
    const updatedFlippedCards = [...flippedCards, index]
    setFlippedCards(updatedFlippedCards)

    // Si hay dos tarjetas volteadas, comprobar si coinciden
    if (updatedFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstIndex, secondIndex] = updatedFlippedCards

      if (cards[firstIndex].content.id === cards[secondIndex].content.id) {
        // Las tarjetas coinciden
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[firstIndex].isMatched = true
          matchedCards[secondIndex].isMatched = true
          setCards(matchedCards)
          setFlippedCards([])
          // Añadir 10 puntos por cada par encontrado
          setScore((prevScore) => prevScore + 10)
        }, 500)
      } else {
        // Las tarjetas no coinciden
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[firstIndex].isFlipped = false
          resetCards[secondIndex].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
          // Restar 1 punto por intento fallido, pero nunca por debajo de 0
          setScore((prevScore) => Math.max(0, prevScore - 1))
        }, 1000)
      }
    }
  }

  // Reiniciar el juego
  const resetGame = () => {
    setCards(createCards())
    setFlippedCards([])
    setMoves(0)
    setScore(0)
    setIsGameComplete(false)
    setIsNewBestScore(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-yellow-300 overflow-hidden absolute inset-0">
      <div className="w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] px-4 py-8 relative">
        {/* Elementos decorativos */}
        <div className="absolute -top-20 -left-20 text-orange-400 opacity-50 transform rotate-12">
          <Star className="w-24 h-24" />
        </div>
        <div className="absolute -bottom-20 -right-20 text-orange-400 opacity-50 transform -rotate-12">
          <Star className="w-24 h-24" />
        </div>

        <div className="mb-12 text-center bg-black bg-opacity-90 backdrop-blur-sm rounded-xl p-8 shadow-xl border-2 border-orange-500">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-orange-500" />
            Juego de Memoria
            <Sparkles className="h-8 w-8 text-orange-500" />
          </h1>
          <p className="text-orange-400 mb-6 text-xl">Encuentra todos los pares de tarjetas</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-sm border border-orange-500/30">
              <div className="text-white font-medium flex items-center justify-center gap-2 text-xl">
                <Medal className="h-6 w-6 text-orange-500" />
                <span>Movimientos:</span>
                <span className="font-bold">{moves}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg shadow-sm border border-orange-500/30">
              <div className="text-white font-medium flex items-center justify-center gap-2 text-xl">
                <Trophy className="h-6 w-6 text-orange-500" />
                <span>Puntaje:</span>
                <span className="font-bold text-orange-400">{score}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-medium flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-orange-500" />
              Mejor: <span className="font-bold text-orange-400">{bestScore}</span>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={resetGame}
              className="flex items-center gap-2 bg-black hover:bg-gray-900 border-orange-500 text-white hover:text-orange-400 text-lg px-6"
            >
              <RotateCcw className="h-5 w-5" />
              Reiniciar
            </Button>
          </div>
        </div>

        {isGameComplete ? (
          <div className="bg-black border-2 border-orange-500 rounded-xl p-10 text-center mb-8 animate-fade-in shadow-xl">
            <div className="relative">
              <Trophy className="h-24 w-24 text-orange-500 mx-auto mb-6" />
              {isNewBestScore && (
                <div className="absolute top-0 right-1/3 animate-pulse">
                  <Sparkles className="h-8 w-8 text-orange-400" />
                </div>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¡Felicidades!</h2>
            <p className="text-orange-400 mb-2 text-xl">Has completado el juego en {moves} movimientos</p>
            <p className="text-orange-500 font-bold text-3xl mb-4">Puntaje final: {score}</p>

            {isNewBestScore && (
              <div className="bg-gray-900 border border-orange-500 rounded-lg p-4 mb-6 animate-bounce-slow">
                <p className="text-white font-bold flex items-center justify-center gap-2 text-xl">
                  <Crown className="h-6 w-6 text-orange-500" />
                  ¡Nuevo récord!
                  <Crown className="h-6 w-6 text-orange-500" />
                </p>
              </div>
            )}

            <Button
              onClick={resetGame}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 text-xl"
            >
              Jugar de nuevo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`
                  aspect-square relative
                  cursor-pointer
                  perspective-1000
                `}
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={`
                    relative w-full h-full
                    transition-transform duration-500
                    transform-style-preserve-3d
                    ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
                  `}
                >
                  {/* Parte frontal (visible cuando no está volteada) */}
                  <div
                    className={`
                      absolute w-full h-full
                      backface-hidden
                      flex items-center justify-center
                      bg-black hover:bg-gray-900
                      rounded-full border-4 border-white border-opacity-20
                      overflow-hidden
                      p-4
                    `}
                  >
                    <Image
                      src="/club-vea-vinos-logo.png"
                      alt="Club Vea Vinos"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Parte trasera (visible cuando está volteada) */}
                  <div
                    className={`
                      absolute w-full h-full
                      backface-hidden rotate-y-180
                      flex items-center justify-center
                      bg-black
                      rounded-full border-4 ${card.isMatched ? "border-orange-500" : "border-orange-500"}
                      overflow-hidden
                      ${card.isMatched ? "opacity-70" : ""}
                      p-4
                    `}
                  >
                    {card.content.isLogo ? (
                      <div className="w-full h-full p-4">
                        <Image
                          src="/vea-logo-nuevo.png"
                          alt="Vea Logo"
                          width={200}
                          height={200}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-white font-bold text-2xl md:text-3xl text-center">{card.content.text}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
