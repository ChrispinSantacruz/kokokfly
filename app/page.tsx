"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import LoginScreen from "@/components/login-screen"
import MainMenu from "@/components/main-menu"
import Instructions from "@/components/instructions"
import LevelSelect from "@/components/level-select"
import GameLevel from "@/components/game-level"
import VehicleCustomization from "@/components/vehicle-customization"


export type GameState = "login" | "menu" | "instructions" | "levelSelect" | "customization" | "playing" | "gameOver"
export type Level = "easy" | "hard"
export type VehicleType = "ship" | "ufo"

export interface User {
  name: string
  email?: string
}

export interface GameProgress {
  easyHighScore: number
  hardHighScore: number
  unlockedShips: number[]
  unlockedUfos: number[]
  selectedShip: number
  selectedUfo: number
}

export default function KokokFlyGame() {
  const [gameState, setGameState] = useState<GameState>("login")
  const [user, setUser] = useState<User | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy")
  const [score, setScore] = useState(0)
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    easyHighScore: 0,
    hardHighScore: 0,
    unlockedShips: [0], // First ship always unlocked
    unlockedUfos: [0], // First UFO always unlocked
    selectedShip: 0,
    selectedUfo: 0,
  })

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("kokok-fly-progress")
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress))
    }
  }, [])

  const saveProgress = (newProgress: GameProgress) => {
    setGameProgress(newProgress)
    localStorage.setItem("kokok-fly-progress", JSON.stringify(newProgress))
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    setGameState("menu")
  }

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore)

    const newProgress = { ...gameProgress }

    // Update high score
    if (selectedLevel === "easy" && finalScore > gameProgress.easyHighScore) {
      newProgress.easyHighScore = finalScore
    } else if (selectedLevel === "hard" && finalScore > gameProgress.hardHighScore) {
      newProgress.hardHighScore = finalScore
    }

    // Unlock vehicles based on score
    if (selectedLevel === "easy") {
      if (finalScore >= 20 && !newProgress.unlockedShips.includes(1)) {
        newProgress.unlockedShips.push(1)
      }
      if (finalScore >= 50 && !newProgress.unlockedShips.includes(2)) {
        newProgress.unlockedShips.push(2)
      }
    } else if (selectedLevel === "hard") {
      if (finalScore >= 20 && !newProgress.unlockedUfos.includes(1)) {
        newProgress.unlockedUfos.push(1)
      }
      if (finalScore >= 50 && !newProgress.unlockedUfos.includes(2)) {
        newProgress.unlockedUfos.push(2)
      }
    }

    saveProgress(newProgress)
    setGameState("gameOver")
  }

  const resetGame = () => {
    setScore(0)
    setGameState("menu")
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('/images/bgame.png')` }}
    >
      <AnimatePresence mode="wait">
        {gameState === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {gameState === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <MainMenu
              user={user!}
              onInstructions={() => setGameState("instructions")}
              onPlay={() => setGameState("levelSelect")}
              onCustomization={() => setGameState("customization")}
              gameProgress={gameProgress}
            />
          </motion.div>
        )}

        {gameState === "instructions" && (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Instructions onBack={() => setGameState("menu")} />
          </motion.div>
        )}

        {gameState === "customization" && (
          <motion.div
            key="customization"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <VehicleCustomization
              gameProgress={gameProgress}
              onSave={saveProgress}
              onBack={() => setGameState("menu")}
            />
          </motion.div>
        )}

        {gameState === "levelSelect" && (
          <motion.div
            key="levelSelect"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <LevelSelect
              onSelectLevel={(level) => {
                setSelectedLevel(level)
                setGameState("playing")
              }}
              onBack={() => setGameState("menu")}
              gameProgress={gameProgress}
            />
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameLevel
              level={selectedLevel}
              onGameOver={handleGameOver}
              onPause={() => setGameState("menu")}
              gameProgress={gameProgress}
            />
          </motion.div>
        )}

        {gameState === "gameOver" && (
          <motion.div
            key="gameOver"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url('/images/gameover.png')` }}
          >
            <div className="bg-black/70 backdrop-blur-sm p-8 rounded-2xl border-4 border-yellow-400 text-center max-w-md mx-4" style={{ marginTop: '15vh' }}>
              <p className="text-white text-2xl mb-2 font-bold">Final Score: {score}</p>
              <p className="text-yellow-300 text-lg mb-6">
                Best Score ({selectedLevel === "easy" ? "Easy" : "Hard"}):{" "}
                {selectedLevel === "easy" ? gameProgress.easyHighScore : gameProgress.hardHighScore}
              </p>

              {/* Show unlock notifications */}
              {((selectedLevel === "easy" && (score >= 20 || score >= 50)) ||
                (selectedLevel === "hard" && (score >= 20 || score >= 50))) && (
                <div className="mb-4 p-3 bg-green-600/20 border border-green-400 rounded-lg">
                  <p className="text-green-400 font-bold">🎉 New Vehicle Unlocked!</p>
                  <p className="text-green-300 text-sm">Check customization menu</p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setGameState("playing")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold transition-colors text-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-colors text-lg"
                >
                  Main Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
