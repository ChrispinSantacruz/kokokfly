"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Level, GameProgress } from "@/app/page"
import GameHUD from "@/components/game-hud"
import Image from "next/image"
import type { useAudio } from "@/hooks/use-audio"

interface GameLevelProps {
  level: Level
  onGameOver: (score: number) => void
  onPause: () => void
  gameProgress: GameProgress
  audio: ReturnType<typeof useAudio>
}

interface ObstacleData {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: "building" | "asteroid" | "cityobstacle"
  velocityX?: number
  velocityY?: number
  passed?: boolean
  asteroidType?: "blue" | "red" | "purple1" | "purple2"
  cityObstacleType?: "floor1" | "floor2" | "floor3" | "floor4" | "air1" | "air2" | "air3" | "air4"
  angle?: number
  orbitRadius?: number
  orbitCenterY?: number
  spinSpeed?: number
  givesPoints?: boolean
  imageUrl?: string
  pairId?: string // To identify building pairs
  isScoreCounted?: boolean // To avoid double counting
}

interface PlayerData {
  x: number
  y: number
  velocityY: number
}

interface TrailParticle {
  id: string
  x: number
  y: number
  opacity: number
  size: number
}

export default function GameLevel({ level, onGameOver, onPause, gameProgress, audio }: GameLevelProps) {
  const [gameRunning, setGameRunning] = useState(true)
  const [score, setScore] = useState(0)
  const [player, setPlayer] = useState<PlayerData>({ x: 100, y: 300, velocityY: 0 })
  const [obstacles, setObstacles] = useState<ObstacleData[]>([])
  const [gameSpeed, setGameSpeed] = useState(level === "easy" ? 3 : 4)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([])
  const [showCrashImage, setShowCrashImage] = useState(false)

  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastObstacleRef = useRef(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const trailIdRef = useRef(0)

  const GRAVITY = level === "easy" ? 0.3 : 0.5
  const JUMP_FORCE = level === "easy" ? -6 : -8
  const RISE_FORCE = level === "easy" ? -0.4 : 0
  const PLAYER_SIZE = 85 // Reduced for better gameplay
  const GAME_WIDTH = 1000
  const GAME_HEIGHT = 700

  // Handle game over in separate effect
  useEffect(() => {
    if (gameOver) {
      onGameOver(score)
    }
  }, [gameOver, score, onGameOver])

  // Reproducir música del nivel al iniciar
  useEffect(() => {
    audio.playLevelMusic(level)
  }, [audio, level])

  const getPlayerImage = () => {
    if (level === "easy") {
      const shipImages = ["/images/kokok-rocket.png", "/images/kokok-car.png", "/images/kokok-ufo.png"]
      return shipImages[gameProgress.selectedShip] || shipImages[0]
    } else {
      const ufoImages = ["/images/kokok-rocket.png", "/images/kokok-car.png", "/images/kokok-ufo.png"]
      return ufoImages[gameProgress.selectedUfo] || ufoImages[0]
    }
  }

  const getBackgroundStyle = () => {
    if (level === "easy") {
      return "bg-cover bg-center bg-no-repeat"
    } else {
      return `bg-cover bg-center bg-no-repeat`
    }
  }

  // Add trail particles
  const addTrailParticle = useCallback(() => {
    if (level === "easy" && isHolding) {
      // Red trail for rocket when holding
      const newParticle: TrailParticle = {
        id: `trail-${trailIdRef.current++}`,
        x: player.x + PLAYER_SIZE / 2,
        y: player.y + PLAYER_SIZE,
        opacity: 1,
        size: Math.random() * 8 + 4,
      }
      setTrailParticles((prev) => [...prev, newParticle])
    } else if (level === "hard") {
      // Blue trail for UFO always
      const newParticle: TrailParticle = {
        id: `trail-${trailIdRef.current++}`,
        x: player.x + PLAYER_SIZE / 2,
        y: player.y + PLAYER_SIZE,
        opacity: 1,
        size: Math.random() * 6 + 3,
      }
      setTrailParticles((prev) => [...prev, newParticle])
    }
  }, [level, isHolding, player.x, player.y])

  const handleInput = useCallback(
    (isPressed: boolean) => {
      if (!gameRunning || isPaused) return

      if (level === "easy") {
        setIsHolding(isPressed)
      } else if (level === "hard" && isPressed) {
        setPlayer((prev) => ({ ...prev, velocityY: JUMP_FORCE }))
      }
    },
    [gameRunning, isPaused, level, JUMP_FORCE],
  )

  const generateObstacle = useCallback(() => {
    const now = Date.now()
    const interval = level === "easy" ? 1800 : 1500 // More frequent for more action
    if (now - lastObstacleRef.current < interval) return

    lastObstacleRef.current = now

    if (level === "easy") {
      // Create pairs of vertically aligned buildings (like Flappy Bird)
      const newObstacles: ObstacleData[] = []
      const xPosition = GAME_WIDTH // Same X position for both buildings
      
      // Much more variable height for buildings
      const FLOOR_BUILDING_HEIGHT = Math.random() * 180 + 120 // Variable height: 120-300px (more range)
      const AIR_BUILDING_HEIGHT = Math.random() * 200 + 100 // Variable height: 100-300px (more range)
      
      // Smaller gap for more challenge
      const gapSize = 180 // Reduced but sufficient space
      const floorBuildingTop = GAME_HEIGHT - FLOOR_BUILDING_HEIGHT
      const airBuildingBottom = AIR_BUILDING_HEIGHT
      
      // Ensure there's sufficient gap between buildings
      const gapStart = airBuildingBottom
      const gapEnd = floorBuildingTop
      
      // If gap is too small, adjust
      if (gapEnd - gapStart < gapSize) {
        const adjustment = (gapSize - (gapEnd - gapStart)) / 2
        // Reduce buildings to make more space
        const adjustedAirHeight = AIR_BUILDING_HEIGHT - adjustment
        const adjustedFloorHeight = FLOOR_BUILDING_HEIGHT - adjustment
        
        // Tipos de edificios intercalados
        const floorTypes = ["floor1", "floor4", "floor3", "floor2"]
        const airTypes = ["air1", "air2", "air3", "air4"]
        
        // TOP BUILDING (attached to top edge)
        const airType = airTypes[Math.floor(Math.random() * airTypes.length)] as "air1" | "air2" | "air3" | "air4"
        const pairId = `pair-${now}` // Unique identifier for the pair
        newObstacles.push({
          id: `city-air-${now}`,
          x: xPosition,
          y: 0, // Attached to top edge
          width: 180,
          height: adjustedAirHeight,
          type: "cityobstacle",
          cityObstacleType: airType,
          passed: false,
          imageUrl: `/images/obstaculo${airType.slice(-1)}aire.png`,
          pairId: pairId,
          isScoreCounted: false,
        })
        
        // FLOOR BUILDING (always from ground up)
        const floorType = floorTypes[Math.floor(Math.random() * floorTypes.length)] as "floor1" | "floor2" | "floor3" | "floor4"
        newObstacles.push({
          id: `city-floor-${now}`,
          x: xPosition,
          y: GAME_HEIGHT - adjustedFloorHeight, // Always from ground up
          width: 180,
          height: adjustedFloorHeight, // Fixed height from ground
          type: "cityobstacle",
          cityObstacleType: floorType,
          passed: false,
          imageUrl: `/images/obstaculo${floorType.slice(-1)}piso.png`,
          pairId: pairId,
          isScoreCounted: false,
        })
      } else {
        // Tipos de edificios intercalados
        const floorTypes = ["floor1", "floor4", "floor3", "floor2"]
        const airTypes = ["air1", "air2", "air3", "air4"]
        
        // TOP BUILDING (attached to top edge)
        const airType = airTypes[Math.floor(Math.random() * airTypes.length)] as "air1" | "air2" | "air3" | "air4"
        const pairId = `pair-${now}` // Unique identifier for the pair
        newObstacles.push({
          id: `city-air-${now}`,
          x: xPosition,
          y: 0, // Attached to top edge
          width: 180,
          height: AIR_BUILDING_HEIGHT,
          type: "cityobstacle",
          cityObstacleType: airType,
          passed: false,
          imageUrl: `/images/obstaculo${airType.slice(-1)}aire.png`,
          pairId: pairId,
          isScoreCounted: false,
        })
        
        // FLOOR BUILDING (always from ground up)
        const floorType = floorTypes[Math.floor(Math.random() * floorTypes.length)] as "floor1" | "floor2" | "floor3" | "floor4"
        newObstacles.push({
          id: `city-floor-${now}`,
          x: xPosition,
          y: GAME_HEIGHT - FLOOR_BUILDING_HEIGHT, // Always from ground up
          width: 180,
          height: FLOOR_BUILDING_HEIGHT, // Fixed height from ground
          type: "cityobstacle",
          cityObstacleType: floorType,
          passed: false,
          imageUrl: `/images/obstaculo${floorType.slice(-1)}piso.png`,
          pairId: pairId,
          isScoreCounted: false,
        })
      }
      
      setObstacles((prev) => [...prev, ...newObstacles])
    } else if (level === "hard") {
      const asteroidTypeChance = Math.random()

      if (asteroidTypeChance < 0.4) {
        // 40% - Blue asteroids (give points)
        const count = Math.floor(Math.random() * 2) + 1 // 1-2 blue asteroids
        for (let i = 0; i < count; i++) {
          const size = Math.random() * 50 + 45
          const newAsteroid: ObstacleData = {
            id: `asteroid-blue-${now}-${i}`,
            x: GAME_WIDTH + i * 200,
            y: Math.random() * (GAME_HEIGHT - size - 100) + 50,
            width: size,
            height: size,
            type: "asteroid",
            asteroidType: "blue",
            passed: false,
            givesPoints: true,
            velocityX: -gameSpeed,
            imageUrl: "/images/piedraazul.png",
          }
          setObstacles((prev) => [...prev, newAsteroid])
        }
      } else if (asteroidTypeChance < 0.6) {
        // 20% - Red meteorites (bouncing, no points)
        const count = Math.floor(Math.random() * 2) + 1 // 1-2 red meteorites
        for (let i = 0; i < count; i++) {
          const size = Math.random() * 55 + 50
          const newAsteroid: ObstacleData = {
            id: `asteroid-red-${now}-${i}`,
            x: GAME_WIDTH + i * 180,
            y: Math.random() * (GAME_HEIGHT - size - 100) + 50,
            width: size,
            height: size,
            type: "asteroid",
            asteroidType: "red",
            passed: false,
            givesPoints: false,
            velocityX: -(gameSpeed + Math.random() * 2),
            velocityY: (Math.random() - 0.5) * 12, // More chaotic bouncing
            angle: 0,
            spinSpeed: (Math.random() - 0.5) * 0.4,
            imageUrl: "/images/piedraroja.png",
          }
          setObstacles((prev) => [...prev, newAsteroid])
        }
      } else {
        // 40% - Purple asteroids (direct, fast, more quantity, no points)
        const count = Math.floor(Math.random() * 4) + 3 // 3-6 purple asteroids
        for (let i = 0; i < count; i++) {
          const size = Math.random() * 45 + 40
          const asteroidType = Math.random() < 0.5 ? "purple1" : "purple2"
          const newAsteroid: ObstacleData = {
            id: `asteroid-purple-${now}-${i}`,
            x: GAME_WIDTH + i * 120, // Closer together
            y: Math.random() * (GAME_HEIGHT - size - 100) + 50,
            width: size,
            height: size,
            type: "asteroid",
            asteroidType,
            passed: false,
            givesPoints: false,
            velocityX: -(gameSpeed + Math.random() * 3 + 1), // Faster and more random
            imageUrl: asteroidType === "purple1" ? "/images/piedra1.png" : "/images/piedra2.png",
          }
          setObstacles((prev) => [...prev, newAsteroid])
        }
      }
    }
  }, [level, gameSpeed, GAME_WIDTH, GAME_HEIGHT])

  const checkCollision = useCallback((playerRect: DOMRect, obstacleRect: DOMRect) => {
    return !(
      playerRect.right < obstacleRect.left ||
      playerRect.left > obstacleRect.right ||
      playerRect.bottom < obstacleRect.top ||
      playerRect.top > obstacleRect.bottom
    )
  }, [])

  const gameLoop = useCallback(() => {
    if (!gameRunning || isPaused || gameOver) return

    // Add trail particles
    if (Math.random() < 0.3) {
      addTrailParticle()
    }

    // Update trail particles
    setTrailParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          opacity: particle.opacity - 0.05,
          y: particle.y + 2,
          size: particle.size * 0.98,
        }))
        .filter((particle) => particle.opacity > 0),
    )

    // Update player
    setPlayer((prev) => {
      let newY = prev.y + prev.velocityY
      let newVelocityY = prev.velocityY

      if (level === "easy") {
        if (isHolding) {
          newVelocityY += RISE_FORCE
        } else {
          newVelocityY += GRAVITY
        }
      } else {
        newVelocityY += GRAVITY
      }

      // Boundaries
      if (newY < 0) {
        newY = 0
        newVelocityY = 0
      }
      if (newY > GAME_HEIGHT - PLAYER_SIZE) {
        setGameRunning(false)
        setGameOver(true)
        return prev
      }

      return { ...prev, y: newY, velocityY: newVelocityY }
    })

    // Update obstacles
    setObstacles((prev) => {
      let newScore = 0
      const passedPairs = new Set<string>() // Para rastrear pares ya pasados

      const updated = prev
        .map((obstacle) => {
          let updatedObstacle = { ...obstacle }

          if (level === "hard" && obstacle.type === "asteroid") {
            if (obstacle.asteroidType === "blue") {
              // Blue asteroids move steadily
              updatedObstacle.x = obstacle.x - gameSpeed
            } else if (obstacle.asteroidType === "red") {
              // Red meteorites bounce chaotically
              const newX = obstacle.x + (obstacle.velocityX || -gameSpeed)
              const newY = obstacle.y + (obstacle.velocityY || 0)
              let newVelocityY = obstacle.velocityY || 0

              if (newY <= 0 || newY >= GAME_HEIGHT - obstacle.height) {
                newVelocityY = -newVelocityY * 0.8
              }

              // Add random velocity changes for chaos
              if (Math.random() < 0.04) {
                newVelocityY += (Math.random() - 0.5) * 8
              }

              const angle = (obstacle.angle || 0) + (obstacle.spinSpeed || 0.1)

              updatedObstacle = {
                ...updatedObstacle,
                x: newX,
                y: Math.max(0, Math.min(GAME_HEIGHT - obstacle.height, newY)),
                velocityY: newVelocityY,
                angle,
              }
            } else if (obstacle.asteroidType === "purple1" || obstacle.asteroidType === "purple2") {
              // Purple asteroids go direct and fast
              updatedObstacle.x = obstacle.x + (obstacle.velocityX || -gameSpeed)
            }
          } else {
            updatedObstacle.x = obstacle.x - gameSpeed
          }

          // Check if obstacle was passed and gives points
          if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            updatedObstacle.passed = true
            
            if (level === "easy" && obstacle.type === "cityobstacle" && obstacle.pairId) {
              // Solo contar 1 punto por par de edificios
              if (!obstacle.isScoreCounted && !passedPairs.has(obstacle.pairId)) {
                passedPairs.add(obstacle.pairId)
              newScore += 1
              }
              // Marcar como contado independientemente
              updatedObstacle.isScoreCounted = true
            } else if (level === "hard" && obstacle.givesPoints) {
              newScore += 1 // Only blue asteroids give points
            }
          }

          return updatedObstacle
        })
        .filter((obstacle) => obstacle.x > -obstacle.width)

      // Update score and speed
      if (newScore > 0) {
        setScore((prevScore) => {
          const totalScore = prevScore + newScore
          if (totalScore % 5 === 0 && totalScore <= 50) {
            // Only increase speed until 50 points, then keep constant
            setGameSpeed((current) => Math.min(current * 1.05, level === "easy" ? 6 : 8))
          }
          return totalScore
        })
      }

      return updated
    })

    // Check collisions with adjusted hitboxes
    const PLAYER_COLLISION_PADDING = 8 // Make player smaller for collision
    const OBSTACLE_COLLISION_PADDING = 15 // Make obstacles smaller for collision
    
    const playerRect = {
      left: player.x + PLAYER_COLLISION_PADDING,
      right: player.x + PLAYER_SIZE - PLAYER_COLLISION_PADDING,
      top: player.y + PLAYER_COLLISION_PADDING,
      bottom: player.y + PLAYER_SIZE - PLAYER_COLLISION_PADDING,
    }

    obstacles.forEach((obstacle) => {
      // Adjust obstacle collision box to be more generous
      const obstacleRect = {
        left: obstacle.x + OBSTACLE_COLLISION_PADDING,
        right: obstacle.x + obstacle.width - OBSTACLE_COLLISION_PADDING,
        top: obstacle.y + OBSTACLE_COLLISION_PADDING,
        bottom: obstacle.y + obstacle.height - OBSTACLE_COLLISION_PADDING,
      }

      if (checkCollision(playerRect as DOMRect, obstacleRect as DOMRect)) {
        setGameRunning(false)
        setShowCrashImage(true)
        audio.playExplosionSound() // Reproducir sonido de explosión al colisionar
        // Mostrar imagen de choque por 1 segundo antes del game over
        setTimeout(() => {
          setShowCrashImage(false)
        setGameOver(true)
        }, 1000)
      }
    })

    generateObstacle()
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [
    gameRunning,
    isPaused,
    gameOver,
    player,
    obstacles,
    level,
    gameSpeed,
    isHolding,
    generateObstacle,
    checkCollision,
    addTrailParticle,
  ])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        handleInput(true)
      } else if (e.code === "Escape") {
        setIsPaused((prev) => !prev)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        if (level === "easy") {
          handleInput(false)
        }
      }
    }

    const handleMouseDown = () => handleInput(true)
    const handleMouseUp = () => {
      if (level === "easy") {
        handleInput(false)
      }
    }

    const handleTouchStart = () => handleInput(true)
    const handleTouchEnd = () => {
      if (level === "easy") {
        handleInput(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleInput, level])

  useEffect(() => {
    if (gameRunning && !isPaused && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameLoop, gameRunning, isPaused, gameOver])

  return (
    <div className="min-h-screen flex flex-col">
      <GameHUD score={score} level={level} onPause={() => setIsPaused(true)} onBack={onPause} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={gameAreaRef}
          className={`relative w-full max-w-5xl aspect-[10/7] rounded-2xl overflow-hidden border-4 border-yellow-400 ${getBackgroundStyle()}`}
          style={
            level === "easy" 
              ? { backgroundImage: `url('/images/leveleasy.png')` }
              : { backgroundImage: `url('/images/space-background.jpg')` }
          }
        >
          {/* Trail Particles */}
          {trailParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full ${
                level === "easy"
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
              }`}
              style={{
                left: `${(particle.x / GAME_WIDTH) * 100}%`,
                top: `${(particle.y / GAME_HEIGHT) * 100}%`,
                width: `${(particle.size / GAME_WIDTH) * 100}%`,
                height: `${(particle.size / GAME_HEIGHT) * 100}%`,
                opacity: particle.opacity,
                boxShadow:
                  level === "easy"
                    ? `0 0 ${particle.size}px rgba(255, 0, 0, ${particle.opacity * 0.5})`
                    : `0 0 ${particle.size}px rgba(0, 100, 255, ${particle.opacity * 0.5})`,
              }}
            />
          ))}

          {/* Player */}
          <motion.div
            className="absolute z-10"
            style={{
              left: `${(player.x / GAME_WIDTH) * 100}%`,
              top: `${(player.y / GAME_HEIGHT) * 100}%`,
              width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
              height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
            }}
            animate={{
              rotate: Math.max(-30, Math.min(30, player.velocityY * 3)),
            }}
            transition={{ duration: 0.1 }}
          >
            <Image src={getPlayerImage() || "/placeholder.svg"} alt="Kokok" fill className="object-contain" />
          </motion.div>



          {/* Obstacles */}
          {obstacles.map((obstacle) => (
            <div key={obstacle.id}>
              {/* Imagen del obstáculo (más grande para edificios de ciudad) */}
            <div
              className="absolute"
              style={{
                left: `${(obstacle.x / GAME_WIDTH) * 100}%`,
                  top: obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("floor") 
                    ? `${((obstacle.y - 50) / GAME_HEIGHT) * 100}%` // Floor buildings extend downward
                    : obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("air")
                    ? `${((obstacle.y - 30) / GAME_HEIGHT) * 100}%` // Air buildings extend upward
                    : `${(obstacle.y / GAME_HEIGHT) * 100}%`,
                width: `${(obstacle.width / GAME_WIDTH) * 100}%`,
                  height: obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("floor")
                    ? `${((obstacle.height + 80) / GAME_HEIGHT) * 100}%` // Floor buildings taller
                    : obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("air")
                    ? `${((obstacle.height + 60) / GAME_HEIGHT) * 100}%` // Air buildings taller
                    : `${(obstacle.height / GAME_HEIGHT) * 100}%`,
                transform: obstacle.angle ? `rotate(${obstacle.angle * 180}deg)` : undefined,
              }}
            >
              {obstacle.type === "building" ? (
                <div className="w-full h-full bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 shadow-lg" />
                ) : obstacle.type === "cityobstacle" ? (
                  <Image 
                    src={obstacle.imageUrl || "/placeholder.svg"} 
                    alt="City Obstacle" 
                    fill 
                    className="object-cover" 
                  />
              ) : (
                <Image src={obstacle.imageUrl || "/placeholder.svg"} alt="Asteroid" fill className="object-contain" />
              )}
              </div>

            </div>
          ))}

          {/* Crash Image at Player Position */}
          {showCrashImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-50"
              style={{
                left: `${(player.x / GAME_WIDTH) * 100}%`,
                top: `${(player.y / GAME_HEIGHT) * 100}%`,
                width: `${(PLAYER_SIZE * 2 / GAME_WIDTH) * 100}%`,
                height: `${(PLAYER_SIZE * 2 / GAME_HEIGHT) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Image
                src="/images/choque.png"
                alt="Crash"
                fill
                className="object-contain"
              />
            </motion.div>
          )}

          {/* Pause Overlay */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
            >
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 p-8 rounded-2xl border-4 border-yellow-400 text-center">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">PAUSED</h2>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsPaused(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={onPause}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Main Menu
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="text-center p-4">
        <p className="text-white text-lg">
          {level === "easy"
            ? ""
            : ""}
        </p>
      </div>
    </div>
  )
}
