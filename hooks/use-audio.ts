import { useRef, useCallback, useEffect } from 'react'

type AudioType = 'menu' | 'level1' | 'level2' | 'explosion' | 'gameover' | 'buttonClick' | 'buttonHover'

interface AudioManager {
  playMenuMusic: () => void
  playLevelMusic: (level: 'easy' | 'hard') => void
  playExplosionSound: () => void
  playGameOverMusic: () => void
  playButtonClickSound: () => void
  playButtonHoverSound: () => void
  stopAllMusic: () => void
  stopLevelMusic: () => void
  setVolume: (volume: number) => void
}

export const useAudio = (): AudioManager => {
  const audioRefs = useRef<{ [key in AudioType]?: HTMLAudioElement }>({})
  const currentMusicRef = useRef<HTMLAudioElement | null>(null)

  // Inicializar los audios
  useEffect(() => {
    audioRefs.current = {
      menu: new Audio('/menu.mp3'),
      level1: new Audio('/level1.mp3'),
      level2: new Audio('/level2.mp3'),
      explosion: new Audio('/Explosion.mp3'),
      gameover: new Audio('/Gameover.mp3'),
      buttonClick: new Audio('/menu.mp3'), // Usaremos una versión corta del menú
      buttonHover: new Audio('/menu.mp3'), // Usaremos una versión corta del menú
    }

    // Configurar música de fondo para que se repita
    if (audioRefs.current.menu) {
      audioRefs.current.menu.loop = true
      audioRefs.current.menu.volume = 0.7
    }
    if (audioRefs.current.level1) {
      audioRefs.current.level1.loop = true
      audioRefs.current.level1.volume = 0.8
    }
    if (audioRefs.current.level2) {
      audioRefs.current.level2.loop = true
      audioRefs.current.level2.volume = 0.8
    }
    if (audioRefs.current.explosion) {
      audioRefs.current.explosion.volume = 0.9
    }
    if (audioRefs.current.buttonClick) {
      audioRefs.current.buttonClick.volume = 0.3
      audioRefs.current.buttonClick.loop = false
    }
    if (audioRefs.current.buttonHover) {
      audioRefs.current.buttonHover.volume = 0.2
      audioRefs.current.buttonHover.loop = false
    }
    if (audioRefs.current.gameover) {
      audioRefs.current.gameover.volume = 0.8
      audioRefs.current.gameover.loop = false
    }

    // Limpiar al desmontar
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause()
          audio.currentTime = 0
        }
      })
    }
  }, [])

  const stopAllMusic = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })
    currentMusicRef.current = null
  }, [])

  const stopLevelMusic = useCallback(() => {
    if (audioRefs.current.level1) {
      audioRefs.current.level1.pause()
      audioRefs.current.level1.currentTime = 0
    }
    if (audioRefs.current.level2) {
      audioRefs.current.level2.pause()
      audioRefs.current.level2.currentTime = 0
    }
  }, [])

  const playMenuMusic = useCallback(() => {
    stopAllMusic()
    const menuAudio = audioRefs.current.menu
    if (menuAudio) {
      menuAudio.currentTime = 0
      menuAudio.play().catch(console.error)
      currentMusicRef.current = menuAudio
    }
  }, [stopAllMusic])

  const playLevelMusic = useCallback((level: 'easy' | 'hard') => {
    stopAllMusic()
    const audioKey = level === 'easy' ? 'level1' : 'level2'
    const levelAudio = audioRefs.current[audioKey]
    if (levelAudio) {
      levelAudio.currentTime = 0
      levelAudio.play().catch(console.error)
      currentMusicRef.current = levelAudio
    }
  }, [stopAllMusic])

  const playExplosionSound = useCallback(() => {
    const explosionAudio = audioRefs.current.explosion
    if (explosionAudio) {
      explosionAudio.currentTime = 0
      explosionAudio.play().catch(console.error)
    }
  }, [])

  const playButtonClickSound = useCallback(() => {
    const buttonClickAudio = audioRefs.current.buttonClick
    if (buttonClickAudio) {
      buttonClickAudio.currentTime = 0
      buttonClickAudio.play().catch(console.error)
    }
  }, [])

  const playButtonHoverSound = useCallback(() => {
    const buttonHoverAudio = audioRefs.current.buttonHover
    if (buttonHoverAudio) {
      buttonHoverAudio.currentTime = 0
      buttonHoverAudio.play().catch(console.error)
    }
  }, [])

  const playGameOverMusic = useCallback(() => {
    // Detener la música de niveles
    stopLevelMusic()
    const gameoverAudio = audioRefs.current.gameover
    if (gameoverAudio) {
      gameoverAudio.currentTime = 0
      gameoverAudio.play().catch(console.error)
      currentMusicRef.current = gameoverAudio
    }
  }, [stopLevelMusic])

  const setVolume = useCallback((volume: number) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume))
      }
    })
  }, [])

  return {
    playMenuMusic,
    playLevelMusic,
    playExplosionSound,
    playGameOverMusic,
    playButtonClickSound,
    playButtonHoverSound,
    stopAllMusic,
    stopLevelMusic,
    setVolume,
  }
} 