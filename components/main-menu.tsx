"use client"

import { motion } from "framer-motion"
import { Trophy, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType, GameProgress } from "@/app/page"
import type { useAudio } from "@/hooks/use-audio"

interface MainMenuProps {
  user: UserType
  onInstructions: () => void
  onPlay: () => void
  onCustomization: () => void
  gameProgress: GameProgress
  audio: ReturnType<typeof useAudio>
}

export default function MainMenu({ user, onInstructions, onPlay, onCustomization, gameProgress, audio }: MainMenuProps) {
  const handleButtonClick = (action: () => void) => {
    audio.playButtonClickSound()
    action()
  }
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url('/images/menu1.png')` }}
    >
      {/* Logo positioned at the top center */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute text-center"
        style={{
          top: "6vh",
          left: "12%",
          transform: "translateX(-50%)",
        }}
      >
        <img 
          src="/images/logo.png" 
          alt="KOKOK THE ROACH Logo"
          className="w-auto h-40 mx-auto drop-shadow-2xl"
        />
      </motion.div>

      {/* Welcome message positioned in the interface area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute"
        style={{
          top: "22vh",
          left: "60%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex items-center justify-center gap-2 text-cyan-300 text-xl">
          <User className="w-8 h-8" />
          <span className="font-bold drop-shadow-lg">Welcome, {user.name}!</span>
        </div>
      </motion.div>

      {/* PLAY button - Red rectangle position */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute"
        style={{
          top: "28.5vh",
          left: "10vw",
          width: "22vw",
          minWidth: "280px",
        }}
      >
        <img
          src="/images/buttons/play.png"
          alt="Play"
          onClick={() => handleButtonClick(onPlay)}
          onMouseEnter={() => audio.playButtonHoverSound()}
          className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
        />
      </motion.div>

      {/* CUSTOMIZE button - Purple rectangle position */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute"
        style={{
          top: "41vh",
          left: "10vw",
          width: "22vw",
          minWidth: "280px",
        }}
      >
        <img
          src="/images/buttons/customize.png"
          alt="Customize"
          onClick={() => handleButtonClick(onCustomization)}
          onMouseEnter={() => audio.playButtonHoverSound()}
          className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
        />
      </motion.div>

      {/* INSTRUCTIONS button - Blue rectangle position */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute"
        style={{
          top: "53.5vh",
          left: "10vw",
          width: "22vw",
          minWidth: "280px",
        }}
      >
        <img
          src="/images/buttons/instructions.png"
          alt="Instructions"
          onClick={() => handleButtonClick(onInstructions)}
          onMouseEnter={() => audio.playButtonHoverSound()}
          className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
        />
      </motion.div>

      {/* HIGH SCORES - Yellow rectangle position */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute"
        style={{
          top: "28vh",
          right: "27.5vw",
          width: "24vw",
          minWidth: "300px",
        }}
      >
        <div className="border-4 border-yellow-400 rounded-2xl p-4 backdrop-blur-sm bg-transparent shadow-lg">
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

      {/* UNLOCKED VEHICLES - Blue rectangle position */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute"
        style={{
          top: "52vh",
          right: "27.5vw",
          width: "24vw",
          minWidth: "300px",
        }}
      >
        <div className="border-4 border-cyan-400 rounded-2xl p-4 backdrop-blur-sm bg-transparent shadow-lg">
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

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute text-center"
        style={{
          bottom: "20vh",
          left: "48%",
          transform: "translateX(-50%)",
        }}
      >
        <p className="text-gray-300 text-lg font-semibold drop-shadow-lg border-2 border-gray-400/30 rounded-full px-6 py-2 backdrop-blur-sm">
          Choose your adventure and help Kokok conquer the skies
        </p>
      </motion.div>
    </div>
  )
}
