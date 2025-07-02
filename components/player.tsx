"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface PlayerProps {
  x: number
  y: number
  velocityY: number
  level: 1 | 2 | 3
}

export default function Player({ x, y, velocityY, level }: PlayerProps) {
  const getPlayerImage = () => {
    switch (level) {
      case 1:
        return "/images/kokok-rocket.png"
      case 2:
        return "/images/kokok-car.png"
      case 3:
        return "/images/kokok-ufo.png"
      default:
        return "/images/kokok-rocket.png"
    }
  }

  return (
    <motion.div
      className="absolute w-16 h-16 z-10"
      style={{ left: x, top: y }}
      animate={{
        rotate: Math.max(-30, Math.min(30, velocityY * 3)),
      }}
      transition={{ duration: 0.1 }}
    >
      <Image src={getPlayerImage() || "/placeholder.svg"} alt="Kokok" fill className="object-contain" />
    </motion.div>
  )
}
