"use client"

import { motion } from "framer-motion"
import { Trophy, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType, GameProgress } from "@/app/page"


interface MainMenuProps {
  user: UserType
  onInstructions: () => void
  onPlay: () => void
  onCustomization: () => void
  gameProgress: GameProgress
}

export default function MainMenu({ user, onInstructions, onPlay, onCustomization, gameProgress }: MainMenuProps) {
  const handleButtonClick = (action: () => void) => {
    action()
  }
  return (
    <div className="min-h-screen p-4 overflow-y-auto relative">
      {/* Background para desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden lg:block"
        style={{ backgroundImage: `url('/images/menu1.png')` }}
      />
      {/* Background para responsive (móvil/tablet) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{ backgroundImage: `url('/images/bgame.png')` }}
      />
      
      {/* Contenido con z-index superior */}
      <div className="relative z-10">
      {/* Contenedor principal con layout responsivo */}
      <div className="max-w-6xl mx-auto h-full min-h-screen flex flex-col justify-center">
        
        {/* Header con Logo y Welcome */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <img 
              src="/images/logo.png" 
              alt="KOKOK THE ROACH Logo"
              className="w-auto h-24 sm:h-32 md:h-40 mx-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-cyan-300 text-lg sm:text-xl">
              <User className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="font-bold drop-shadow-lg">Welcome, {user.name}!</span>
            </div>
          </motion.div>
        </div>

        {/* Layout principal: En desktop lado a lado, en móvil apilado */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Columna izquierda: Botones de navegación */}
          <div className="flex flex-col space-y-4 order-1">
            
            {/* PLAY button */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <img
                src="/images/buttons/play.png"
                alt="Play"
                onClick={() => handleButtonClick(onPlay)}
                className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
              />
            </motion.div>

            {/* CUSTOMIZE button */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <img
                src="/images/buttons/customize.png"
                alt="Customize"
                onClick={() => handleButtonClick(onCustomization)}
                className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
              />
            </motion.div>

            {/* INSTRUCTIONS button */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <img
                src="/images/buttons/instructions.png"
                alt="Instructions"
                onClick={() => handleButtonClick(onInstructions)}
                className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
              />
            </motion.div>
          </div>

          {/* Columna derecha: Estadísticas y progreso */}
          <div className="flex flex-col space-y-6 order-2">
            
            {/* HIGH SCORES */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <div className="border-4 border-yellow-400 rounded-2xl p-4 backdrop-blur-sm bg-black/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-yellow-400 drop-shadow">HIGH SCORES</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center border-2 border-green-400/50 p-2 rounded-lg backdrop-blur-sm">
                    <span className="text-green-400 font-semibold text-sm">Easy Mode</span>
                    <span className="text-white font-bold text-lg">{gameProgress.easyHighScore}</span>
                  </div>
                  <div className="flex justify-between items-center border-2 border-red-400/50 p-2 rounded-lg backdrop-blur-sm">
                    <span className="text-red-400 font-semibold text-sm">Hard Mode</span>
                    <span className="text-white font-bold text-lg">{gameProgress.hardHighScore}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UNLOCKED VEHICLES */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <div className="border-4 border-cyan-400 rounded-2xl p-4 backdrop-blur-sm bg-black/20 shadow-lg">
                <h4 className="text-cyan-400 font-bold mb-3 text-lg drop-shadow">Unlocked Vehicles</h4>
                <div className="space-y-2">
                  <div className="flex justify-between border-2 border-cyan-400/30 p-2 rounded backdrop-blur-sm">
                    <span className="text-gray-300 font-semibold text-sm">Ships:</span>
                    <span className="text-white font-bold">{gameProgress.unlockedShips.length}/3</span>
                  </div>
                  <div className="flex justify-between border-2 border-cyan-400/30 p-2 rounded backdrop-blur-sm">
                    <span className="text-gray-300 font-semibold text-sm">UFOs:</span>
                    <span className="text-white font-bold">{gameProgress.unlockedUfos.length}/3</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-300 text-sm sm:text-base font-semibold drop-shadow-lg border-2 border-gray-400/30 rounded-full px-4 py-2 backdrop-blur-sm inline-block bg-black/20">
            Choose your adventure and help Kokok conquer the skies
          </p>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
