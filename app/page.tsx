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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-yellow-300">
      <div className="w-full max-w-[90vw] sm:max-w-xs relative">
        {/* Elementos decorativos */}
        <div className="absolute -top-10 -left-10 text-orange-400 opacity-50 transform rotate-12">
          <Star className="w-16 h-16" />
        </div>
 

        <div className="mb-8 text-center bg-black bg-opacity-90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-orange-500">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-500" />
            Juego de Memoria
            <Sparkles className="h-6 w-6 text-orange-500" />
          </h1>
          <p className="text-orange-400 mb-4">Encuentra todos los pares de tarjetas</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-lg shadow-sm border border-orange-500/30">
              <div className="text-white font-medium flex items-center justify-center gap-1">
                <Medal className="h-4 w-4 text-orange-500" />
                <span>Movimientos:</span>
                <span className="font-bold">{moves}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg shadow-sm border border-orange-500/30">
              <div className="text-white font-medium flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-orange-500" />
                <span>Puntaje:</span>
                <span className="font-bold text-orange-400">{score}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-white font-medium flex items-center gap-1">
              <Crown className="h-4 w-4 text-orange-500" />
              Mejor: <span className="font-bold text-orange-400">{bestScore}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className="flex items-center gap-1 bg-black hover:bg-gray-900 border-orange-500 text-white hover:text-orange-400"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>

        {isGameComplete ? (
          <div className="bg-black border border-orange-500 rounded-xl p-8 text-center mb-6 animate-fade-in shadow-lg">
            <div className="relative">
              <Trophy className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              {isNewBestScore && (
                <div className="absolute top-0 right-1/3 animate-pulse">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Felicidades!</h2>
            <p className="text-orange-400 mb-1">Has completado el juego en {moves} movimientos</p>
            <p className="text-orange-500 font-bold text-2xl mb-2">Puntaje final: {score}</p>

            {isNewBestScore && (
              <div className="bg-gray-900 border border-orange-500 rounded-lg p-2 mb-4 animate-bounce-slow">
                <p className="text-white font-bold flex items-center justify-center gap-1">
                  <Crown className="h-5 w-5 text-orange-500" />
                  ¡Nuevo récord!
                  <Crown className="h-5 w-5 text-orange-500" />
                </p>
              </div>
            )}

            <Button onClick={resetGame} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2">
              Jugar de nuevo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
                      rounded-full border-2 border-white border-opacity-20
                      overflow-hidden
                    `}
                  >
                    <Image
                      src="/club-vea-vinos-logo.png"
                      alt="Club Vea Vinos"
                      width={100}
                      height={100}
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
                      rounded-full border-2 ${card.isMatched ? "border-orange-500" : "border-orange-500"}
                      overflow-hidden
                      ${card.isMatched ? "opacity-70" : ""}
                    `}
                  >
                    {card.content.isLogo ? (
                      <div className="w-full h-full p-2">
                        <Image
                          src="/vea-logo.png"
                          alt="Vea Logo"
                          width={100}
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-white font-bold text-lg sm:text-xl text-center">{card.content.text}</span>
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
