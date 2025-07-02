"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Level, GameProgress } from "@/app/page"
import GameHUD from "@/components/game-hud"
import Image from "next/image"


interface GameLevelProps {
  level: Level
  onGameOver: (score: number) => void
  onPause: () => void
  gameProgress: GameProgress
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

export default function GameLevel({ level, onGameOver, onPause, gameProgress }: GameLevelProps) {
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
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef(0)
  const isMobileRef = useRef(typeof window !== 'undefined' && window.innerWidth < 768)

  const GRAVITY = level === "easy" ? 0.3 : 0.5
  const JUMP_FORCE = level === "easy" ? -6 : -8
  const RISE_FORCE = level === "easy" ? -0.4 : 0
  const PLAYER_SIZE = 85
  const GAME_WIDTH = 1000
  const GAME_HEIGHT = 700
  const TARGET_FPS = isMobileRef.current ? 30 : 60 // 30fps para móvil
  const FIXED_DELTA = 1000 / TARGET_FPS
  const MAX_PARTICLES = isMobileRef.current ? 5 : 20 // Menos partículas en móvil

  // Handle game over in separate effect
  useEffect(() => {
    if (gameOver) {
      onGameOver(score)
    }
  }, [gameOver, score, onGameOver])



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
    // Solo agregar partículas en desktop
    if (isMobileRef.current) return
    
    if (level === "easy" && isHolding) {
      // Red trail for rocket when holding
      const newParticle: TrailParticle = {
        id: `trail-${trailIdRef.current++}`,
        x: player.x + PLAYER_SIZE / 2,
        y: player.y + PLAYER_SIZE,
        opacity: 1,
        size: Math.random() * 8 + 4,
      }
      setTrailParticles((prev) => [...prev.slice(-MAX_PARTICLES + 1), newParticle])
    } else if (level === "hard") {
      // Blue trail for UFO always
      const newParticle: TrailParticle = {
        id: `trail-${trailIdRef.current++}`,
        x: player.x + PLAYER_SIZE / 2,
        y: player.y + PLAYER_SIZE,
        opacity: 1,
        size: Math.random() * 6 + 3,
      }
      setTrailParticles((prev) => [...prev.slice(-MAX_PARTICLES + 1), newParticle])
    }
  }, [level, isHolding, player.x, player.y, MAX_PARTICLES])

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

  const gameLoop = useCallback((currentTime: number) => {
    if (!gameRunning || isPaused || gameOver) return

    // Calculate delta time for consistent frame rate
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime
    }
    
    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    
    // Limit delta time to prevent large jumps (if tab is inactive)
    const clampedDelta = Math.min(deltaTime, FIXED_DELTA * 2)
    const deltaMultiplier = clampedDelta / FIXED_DELTA

    // Throttle frame rate más agresivo en móvil
    frameCountRef.current++
    const frameThreshold = isMobileRef.current ? FIXED_DELTA * 1.5 : FIXED_DELTA * 0.8
    if (deltaTime < frameThreshold) {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
      return
    }

    // Add trail particles (menos frecuente en móvil)
    const particleFrequency = isMobileRef.current ? 8 : 3
    if (frameCountRef.current % particleFrequency === 0 && Math.random() < 0.4) {
      addTrailParticle()
    }

    // Update trail particles (solo en desktop o cada 2 frames en móvil)
    if (!isMobileRef.current || frameCountRef.current % 2 === 0) {
      setTrailParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            opacity: particle.opacity - (0.08 * deltaMultiplier), // Fade faster
            y: particle.y + (3 * deltaMultiplier), // Move faster
            size: particle.size * Math.pow(0.95, deltaMultiplier), // Shrink faster
          }))
          .filter((particle) => particle.opacity > 0.1 && particle.y < GAME_HEIGHT + 30)
        
        return updated.slice(-MAX_PARTICLES)
      })
    }

    // Update player with delta time
    setPlayer((prev) => {
      let newY = prev.y + (prev.velocityY * deltaMultiplier)
      let newVelocityY = prev.velocityY

      if (level === "easy") {
        if (isHolding) {
          newVelocityY += RISE_FORCE * deltaMultiplier
        } else {
          newVelocityY += GRAVITY * deltaMultiplier
        }
      } else {
        newVelocityY += GRAVITY * deltaMultiplier
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

    // Update obstacles with simplified logic for mobile
    setObstacles((prev) => {
      let newScore = 0
      const passedPairs = new Set<string>()

      const updated = prev
        .map((obstacle) => {
          let updatedObstacle = { ...obstacle }
          const speedMultiplier = gameSpeed * deltaMultiplier

          // Simplified movement for mobile
          if (isMobileRef.current) {
            updatedObstacle.x = obstacle.x - speedMultiplier
          } else {
            // Full logic for desktop
            if (level === "hard" && obstacle.type === "asteroid") {
              if (obstacle.asteroidType === "blue") {
                updatedObstacle.x = obstacle.x - speedMultiplier
              } else if (obstacle.asteroidType === "red") {
                const newX = obstacle.x + ((obstacle.velocityX || -gameSpeed) * deltaMultiplier)
                const newY = obstacle.y + ((obstacle.velocityY || 0) * deltaMultiplier)
                let newVelocityY = obstacle.velocityY || 0

                if (newY <= 0 || newY >= GAME_HEIGHT - obstacle.height) {
                  newVelocityY = -newVelocityY * 0.8
                }

                if (Math.random() < (0.04 * deltaMultiplier)) {
                  newVelocityY += (Math.random() - 0.5) * 8
                }

                const angle = (obstacle.angle || 0) + ((obstacle.spinSpeed || 0.1) * deltaMultiplier)

                updatedObstacle = {
                  ...updatedObstacle,
                  x: newX,
                  y: Math.max(0, Math.min(GAME_HEIGHT - obstacle.height, newY)),
                  velocityY: newVelocityY,
                  angle,
                }
              } else if (obstacle.asteroidType === "purple1" || obstacle.asteroidType === "purple2") {
                updatedObstacle.x = obstacle.x + ((obstacle.velocityX || -gameSpeed) * deltaMultiplier)
              }
            } else {
              updatedObstacle.x = obstacle.x - speedMultiplier
            }
          }

          // Check if obstacle was passed and gives points
          if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            updatedObstacle.passed = true
            
            if (level === "easy" && obstacle.type === "cityobstacle" && obstacle.pairId) {
              if (!obstacle.isScoreCounted && !passedPairs.has(obstacle.pairId)) {
                passedPairs.add(obstacle.pairId)
                newScore += 1
              }
              updatedObstacle.isScoreCounted = true
            } else if (level === "hard" && obstacle.givesPoints) {
              newScore += 1
            }
          }

          return updatedObstacle
        })
        .filter((obstacle) => obstacle.x > -obstacle.width - 100)

      // Update score and speed
      if (newScore > 0) {
        setScore((prevScore) => {
          const totalScore = prevScore + newScore
          if (totalScore % 5 === 0 && totalScore <= 50) {
            const maxSpeed = isMobileRef.current ? 5 : (level === "easy" ? 6 : 8)
            setGameSpeed((current) => Math.min(current * 1.05, maxSpeed))
          }
          return totalScore
        })
      }

      return updated
    })

    // Simplified collision detection for mobile
    const PLAYER_COLLISION_PADDING = isMobileRef.current ? 12 : 8
    const OBSTACLE_COLLISION_PADDING = isMobileRef.current ? 20 : 15
    
    const playerRect = {
      left: player.x + PLAYER_COLLISION_PADDING,
      right: player.x + PLAYER_SIZE - PLAYER_COLLISION_PADDING,
      top: player.y + PLAYER_COLLISION_PADDING,
      bottom: player.y + PLAYER_SIZE - PLAYER_COLLISION_PADDING,
    }

    // Check collisions less frequently on mobile
    if (!isMobileRef.current || frameCountRef.current % 2 === 0) {
      obstacles.forEach((obstacle) => {
        const obstacleRect = {
          left: obstacle.x + OBSTACLE_COLLISION_PADDING,
          right: obstacle.x + obstacle.width - OBSTACLE_COLLISION_PADDING,
          top: obstacle.y + OBSTACLE_COLLISION_PADDING,
          bottom: obstacle.y + obstacle.height - OBSTACLE_COLLISION_PADDING,
        }

        if (checkCollision(playerRect as DOMRect, obstacleRect as DOMRect)) {
          setGameRunning(false)
          setShowCrashImage(true)
          setTimeout(() => {
            setShowCrashImage(false)
            setGameOver(true)
          }, 1000)
        }
      })
    }

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
    addTrailParticle
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
      lastTimeRef.current = 0 // Reset timing on game start
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameLoop, gameRunning, isPaused, gameOver])

  // Cleanup on component unmount
  useEffect(() => {
    // Detectar móvil de manera más precisa
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                      window.innerWidth < 768 ||
                      ('ontouchstart' in window)
      isMobileRef.current = isMobile
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      window.removeEventListener('resize', checkMobile)
      // Reset references
      lastTimeRef.current = 0
      frameCountRef.current = 0
      // Clear particles for better performance
      setTrailParticles([])
      setObstacles([])
    }
  }, [])

  // Reset game state cuando cambia el nivel
  useEffect(() => {
    setTrailParticles([])
    setObstacles([])
    setScore(0)
    setPlayer({ x: 100, y: 300, velocityY: 0 })
    setGameSpeed(level === "easy" ? 3 : 4)
    lastTimeRef.current = 0
    frameCountRef.current = 0
    lastObstacleRef.current = 0
  }, [level])

  return (
    <div className="min-h-screen flex flex-col select-none touch-none">
      <GameHUD score={score} level={level} onPause={() => setIsPaused(true)} onBack={onPause} />

      <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div
          ref={gameAreaRef}
          className={`relative w-full max-w-5xl rounded-2xl overflow-hidden border-4 border-yellow-400 ${getBackgroundStyle()} aspect-[16/12] md:aspect-[10/7] ${isMobileRef.current ? 'mobile-optimized' : 'game-container'}`}
          style={{
            backgroundImage: level === "easy" 
              ? `url('/images/leveleasy.png')` 
              : `url('/images/space-background.jpg')`,
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            // Optimizaciones específicas para móvil
            ...(isMobileRef.current && {
              willChange: 'auto',
              transform: 'none',
              backfaceVisibility: 'visible'
            })
          }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Trail Particles - Solo en desktop */}
          {!isMobileRef.current && trailParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full game-element ${
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
                boxShadow: isMobileRef.current ? 'none' :
                  level === "easy"
                    ? `0 0 ${particle.size}px rgba(255, 0, 0, ${particle.opacity * 0.5})`
                    : `0 0 ${particle.size}px rgba(0, 100, 255, ${particle.opacity * 0.5})`,
              }}
            />
          ))}

          {/* Player */}
          <motion.div
            className={`absolute z-10 ${isMobileRef.current ? '' : 'game-element'}`}
            style={{
              left: `${(player.x / GAME_WIDTH) * 100}%`,
              top: `${(player.y / GAME_HEIGHT) * 100}%`,
              width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
              height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
            }}
            animate={isMobileRef.current ? false : {
              rotate: Math.max(-30, Math.min(30, player.velocityY * 3)),
            }}
            transition={isMobileRef.current ? { duration: 0 } : { duration: 0.1 }}
          >
            <Image 
              src={getPlayerImage() || "/placeholder.svg"} 
              alt="Kokok" 
              fill 
              className="object-contain" 
              priority={true}
              quality={isMobileRef.current ? 75 : 90}
            />
          </motion.div>

          {/* Obstacles */}
          {obstacles.map((obstacle) => (
            <div key={obstacle.id}>
              {/* Imagen del obstáculo */}
            <div
              className="absolute game-element"
              style={{
                left: `${(obstacle.x / GAME_WIDTH) * 100}%`,
                  top: obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("floor") 
                    ? `${((obstacle.y - 50) / GAME_HEIGHT) * 100}%`
                    : obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("air")
                    ? `${((obstacle.y - 30) / GAME_HEIGHT) * 100}%`
                    : `${(obstacle.y / GAME_HEIGHT) * 100}%`,
                width: `${(obstacle.width / GAME_WIDTH) * 100}%`,
                  height: obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("floor")
                    ? `${((obstacle.height + 80) / GAME_HEIGHT) * 100}%`
                    : obstacle.type === "cityobstacle" && obstacle.cityObstacleType?.includes("air")
                    ? `${((obstacle.height + 60) / GAME_HEIGHT) * 100}%`
                    : `${(obstacle.height / GAME_HEIGHT) * 100}%`,
                transform: isMobileRef.current ? undefined : 
                  (obstacle.angle ? `rotate(${obstacle.angle * 180}deg)` : undefined),
              }}
            >
              {obstacle.type === "building" ? (
                <div className={`w-full h-full ${isMobileRef.current ? 
                  'bg-gray-700' : 
                  'bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500 shadow-lg'}`} />
                ) : obstacle.type === "cityobstacle" ? (
                  <Image 
                    src={obstacle.imageUrl || "/placeholder.svg"} 
                    alt="City Obstacle" 
                    fill 
                    className="object-cover" 
                    priority={!isMobileRef.current}
                  />
              ) : (
                <Image 
                  src={obstacle.imageUrl || "/placeholder.svg"} 
                  alt="Asteroid" 
                  fill 
                  className="object-contain" 
                  priority={!isMobileRef.current}
                />
              )}
              </div>
            </div>
          ))}

          {/* Crash Image at Player Position */}
          {showCrashImage && (
            <motion.div
              initial={isMobileRef.current ? {} : { opacity: 0, scale: 0.5 }}
              animate={isMobileRef.current ? {} : { opacity: 1, scale: 1 }}
              className="absolute z-50 game-element"
              style={{
                left: `${(player.x / GAME_WIDTH) * 100}%`,
                top: `${(player.y / GAME_HEIGHT) * 100}%`,
                width: `${(PLAYER_SIZE * 2 / GAME_WIDTH) * 100}%`,
                height: `${(PLAYER_SIZE * 2 / GAME_HEIGHT) * 100}%`,
                transform: 'translate(-50%, -50%)',
                opacity: isMobileRef.current ? 1 : undefined
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
