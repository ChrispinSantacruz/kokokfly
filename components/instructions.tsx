"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstructionsProps {
  onBack: () => void
}

export default function Instructions({ onBack }: InstructionsProps) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center"
         style={{ backgroundImage: `url('/images/instruccion.png')` }}>
      
      {/* Botón de regresar flotante */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-10"
      >
        <Button
          onClick={onBack}
          className="bg-black/50 backdrop-blur-sm border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 px-6 py-3 text-lg font-bold"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          BACK
        </Button>
      </motion.div>

      {/* Contenido de instrucciones */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full flex items-center justify-center p-8"
      >
        <div className="bg-black/70 backdrop-blur-md rounded-3xl p-8 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-yellow-400 text-center mb-8">
            HOW TO PLAY
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Easy Level Instructions */}
            <div className="bg-gradient-to-b from-green-500/20 to-green-700/20 rounded-xl p-6 border-2 border-green-400">
              <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">
                EASY LEVEL
              </h2>
              <div className="space-y-4 text-white text-lg">
                <p>🌆 <strong>Setting:</strong> City environment</p>
                <p>🎮 <strong>Controls:</strong> Hold to rise, release to fall</p>
                <p>🏢 <strong>Obstacles:</strong> Buildings of varying heights</p>
                <p>⭐ <strong>Difficulty:</strong> Beginner friendly</p>
                <p>💡 <strong>Tip:</strong> Maintain steady control for smooth flight</p>
              </div>
            </div>

            {/* Hard Level Instructions */}
            <div className="bg-gradient-to-b from-red-500/20 to-red-700/20 rounded-xl p-6 border-2 border-red-400">
              <h2 className="text-3xl font-bold text-red-400 mb-4 text-center">
                HARD LEVEL
              </h2>
              <div className="space-y-4 text-white text-lg">
                <p>🚀 <strong>Setting:</strong> Space environment</p>
                <p>🎮 <strong>Controls:</strong> Tap to jump, gravity pulls down</p>
                <p>☄️ <strong>Obstacles:</strong> Asteroids and space debris</p>
                <p>⭐ <strong>Difficulty:</strong> Advanced challenge</p>
                <p>💡 <strong>Tip:</strong> Time your taps carefully to navigate tight spaces</p>
              </div>
            </div>
          </div>

          {/* General Tips */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border-2 border-purple-400">
            <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">
              GENERAL TIPS
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-white text-lg">
              <p>🎯 Collect points by passing through gaps</p>
              <p>🚁 Unlock new vehicles by achieving high scores</p>
              <p>💥 Avoid colliding with obstacles</p>
              <p>📈 Game speed increases as you progress</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
