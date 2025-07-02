"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameProgress } from "@/app/page"
import Image from "next/image"

interface VehicleCustomizationProps {
  gameProgress: GameProgress
  onSave: (progress: GameProgress) => void
  onBack: () => void
}

export default function VehicleCustomization({ gameProgress, onSave, onBack }: VehicleCustomizationProps) {
  const ships = [
    { id: 0, name: "Classic Rocket", image: "/images/kokok-rocket.png", unlockScore: 0 },
    { id: 1, name: "Speed Car", image: "/images/kokok-car.png", unlockScore: 50 },
    { id: 2, name: "Elite UFO", image: "/images/kokok-ufo.png", unlockScore: 100 },
  ]

  const ufos = [
    { id: 0, name: "Basic Rocket", image: "/images/kokok-rocket.png", unlockScore: 0 },
    { id: 1, name: "Advanced Car", image: "/images/kokok-car.png", unlockScore: 50 },
    { id: 2, name: "Elite UFO", image: "/images/kokok-ufo.png", unlockScore: 100 },
  ]

  const selectShip = (shipId: number) => {
    if (gameProgress.unlockedShips.includes(shipId)) {
      const newProgress = { ...gameProgress, selectedShip: shipId }
      onSave(newProgress)
    }
  }

  const selectUfo = (ufoId: number) => {
    if (gameProgress.unlockedUfos.includes(ufoId)) {
      const newProgress = { ...gameProgress, selectedUfo: ufoId }
      onSave(newProgress)
    }
  }

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/images/custobg.png')` }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            onClick={onBack}
            className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:text-cyan-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">CUSTOMIZE VEHICLES</h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ships Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="border-4 border-green-400 rounded-2xl p-6 backdrop-blur-sm bg-transparent shadow-lg"
          >
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center drop-shadow">SHIPS (Easy Mode)</h2>
            <div className="space-y-4">
              {ships.map((ship) => {
                const isUnlocked = gameProgress.unlockedShips.includes(ship.id)
                const isSelected = gameProgress.selectedShip === ship.id

                return (
                  <motion.div
                    key={ship.id}
                    whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-400/20"
                        : isUnlocked
                          ? "border-green-300 bg-transparent cursor-pointer hover:bg-white/10"
                          : "border-gray-600 bg-transparent opacity-60"
                    }`}
                    onClick={() => selectShip(ship.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={ship.image || "/placeholder.svg"}
                          alt={ship.name}
                          fill
                          className={`object-contain ${!isUnlocked ? "grayscale opacity-50" : ""}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${isUnlocked ? "text-white" : "text-gray-500"} drop-shadow`}>
                          {ship.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-semibold">
                          {ship.unlockScore === 0 ? "Default" : `Unlock at ${ship.unlockScore} points`}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {isSelected ? (
                          <Check className="w-6 h-6 text-yellow-400" />
                        ) : !isUnlocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* UFOs Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="border-4 border-red-400 rounded-2xl p-6 backdrop-blur-sm bg-transparent shadow-lg"
          >
            <h2 className="text-2xl font-bold text-red-400 mb-6 text-center drop-shadow">UFOs (Hard Mode)</h2>
            <div className="space-y-4">
              {ufos.map((ufo) => {
                const isUnlocked = gameProgress.unlockedUfos.includes(ufo.id)
                const isSelected = gameProgress.selectedUfo === ufo.id

                return (
                  <motion.div
                    key={ufo.id}
                    whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-400/20"
                        : isUnlocked
                          ? "border-red-300 bg-transparent cursor-pointer hover:bg-white/10"
                          : "border-gray-600 bg-transparent opacity-60"
                    }`}
                    onClick={() => selectUfo(ufo.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={ufo.image || "/placeholder.svg"}
                          alt={ufo.name}
                          fill
                          className={`object-contain ${!isUnlocked ? "grayscale opacity-50" : ""}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold ${isUnlocked ? "text-white" : "text-gray-500"} drop-shadow`}>
                          {ufo.name}
                        </h3>
                        <p className="text-sm text-gray-400 font-semibold">
                          {ufo.unlockScore === 0 ? "Default" : `Unlock at ${ufo.unlockScore} points`}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {isSelected ? (
                          <Check className="w-6 h-6 text-yellow-400" />
                        ) : !isUnlocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 border-4 border-cyan-400 rounded-2xl p-6 backdrop-blur-sm bg-transparent shadow-lg"
        >
          <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center drop-shadow">HOW TO UNLOCK</h3>
          <div className="grid md:grid-cols-2 gap-6 text-white text-center">
            <div className="border-2 border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-green-400 font-semibold mb-2">Easy Mode Ships</p>
              <p className="text-sm font-semibold">Score 50 and 100 points in Easy Mode to unlock new ships</p>
            </div>
            <div className="border-2 border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-400 font-semibold mb-2">Hard Mode UFOs</p>
              <p className="text-sm font-semibold">Score 50 and 100 points in Hard Mode to unlock new UFOs</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-300 text-lg font-semibold drop-shadow border-2 border-gray-400/30 rounded-full px-6 py-2 backdrop-blur-sm inline-block">
            Customize your ride and show off your style!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
