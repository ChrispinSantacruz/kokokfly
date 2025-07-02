"use client"

import { Pause, ArrowLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Level } from "@/app/page"

interface GameHUDProps {
  score: number
  level: Level
  onPause: () => void
  onBack: () => void
}

export default function GameHUD({ score, level, onPause, onBack }: GameHUDProps) {
  const getLevelName = () => {
    return level === "easy" ? "EASY" : "HARD"
  }

  const getLevelColor = () => {
    return level === "easy" ? "text-green-400" : "text-red-400"
  }

  return (
    <div className="bg-black/80 backdrop-blur-lg p-4 border-b-2 border-yellow-400">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-white/10 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Menu
          </Button>

          <div className="flex items-center gap-2">
            <Trophy className={`w-5 h-5 ${getLevelColor()}`} />
            <span className={`font-bold text-lg ${getLevelColor()}`}>{getLevelName()} MODE</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-yellow-400 text-sm font-semibold">SCORE</div>
            <div className="text-white text-2xl font-bold">{score}</div>
          </div>

          <Button
            onClick={onPause}
            variant="outline"
            size="sm"
            className="bg-white/10 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
          >
            <Pause className="w-4 h-4 mr-1" />
            Pause
          </Button>
        </div>
      </div>
    </div>
  )
}
