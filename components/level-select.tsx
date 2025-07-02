"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Level, GameProgress } from "@/app/page"
import type { useAudio } from "@/hooks/use-audio"
import Image from "next/image"

interface LevelSelectProps {
  onSelectLevel: (level: Level) => void
  onBack: () => void
  gameProgress: GameProgress
  audio: ReturnType<typeof useAudio>
}

export default function LevelSelect({ onSelectLevel, onBack, gameProgress, audio }: LevelSelectProps) {
  const handleButtonClick = (action: () => void) => {
    audio.playButtonClickSound()
    action()
  }
  const levels = [
    {
      id: "easy" as Level,
      name: "EASY",
      description: "Geometry Dash style controls",
      color: "border-green-400",
      textColor: "text-green-400",
      icon: Target,
      image: "/images/kokok-rocket.png",
      details: ["Hold to rise, release to fall", "Navigate between buildings", "Perfect for beginners"],
      highScore: gameProgress.easyHighScore,
    },
    {
      id: "hard" as Level,
      name: "HARD",
      description: "Flappy Bird with chaotic asteroids",
      color: "border-red-400",
      textColor: "text-red-400",
      icon: Zap,
      image: "/images/kokok-ufo.png",
      details: ["Tap to flap and fly", "Dodge crazy asteroids", "Maximum challenge"],
      highScore: gameProgress.hardHighScore,
    },
  ]

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/bgame.png')` }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            onClick={() => handleButtonClick(onBack)}
            onMouseEnter={() => audio.playButtonHoverSound()}
            className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">SELECT LEVEL</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {levels.map((level, index) => {
            const IconComponent = level.icon
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className={`border-4 ${level.color} rounded-2xl p-6 backdrop-blur-sm bg-transparent hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg`}
                onClick={() => handleButtonClick(() => onSelectLevel(level.id))}
                onMouseEnter={() => audio.playButtonHoverSound()}
              >
                <div className="text-center mb-6">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={level.image || "/placeholder.svg"}
                      alt={`Kokok ${level.name}`}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <IconComponent className={`w-6 h-6 ${level.textColor}`} />
                    <h3 className={`text-2xl font-bold ${level.textColor} drop-shadow`}>{level.name} MODE</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 font-semibold">{level.description}</p>
                </div>

                <div className="space-y-2 mb-6">
                  {level.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="font-semibold">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="border-2 border-white/30 p-3 rounded-lg mb-4 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm font-semibold">High Score:</span>
                    <span className="text-yellow-400 font-bold text-lg">{level.highScore}</span>
                  </div>
                </div>

                <Button
                  className={`w-full bg-transparent border-3 ${level.color} ${level.textColor} hover:bg-white/10 font-bold py-3 rounded-xl shadow-lg transition-all duration-200 backdrop-blur-sm`}
                >
                  PLAY {level.name}
                </Button>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-300 text-lg font-semibold drop-shadow border-2 border-gray-400/30 rounded-full px-6 py-2 backdrop-blur-sm inline-block">
            Choose your difficulty and prove your flying skills
          </p>
        </motion.div>
      </div>
    </div>
  )
}
