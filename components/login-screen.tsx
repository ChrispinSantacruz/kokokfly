"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User as UserType } from "@/app/page"

interface LoginScreenProps {
  onLogin: (user: UserType) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<{ name?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onLogin({ name: name.trim() })
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url('/images/login1.png')` }}
    >
      {/* Contenedor principal centrado */}
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <img 
            src="/images/logo.png" 
            alt="KOKOK THE ROACH Logo"
            className="w-auto h-32 sm:h-40 mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          {/* Input de nombre */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-transparent border-2 border-cyan-400/80 text-white placeholder-gray-300 focus:border-yellow-400 focus:ring-yellow-400/50 rounded-xl h-14 sm:h-16 text-base sm:text-lg font-semibold backdrop-blur-sm shadow-lg w-full"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-sm mt-1 font-semibold drop-shadow text-center">{errors.name}</p>
            )}
          </motion.div>

          {/* Botón Start Adventure */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full"
          >
            <img
              src="/images/buttons/start.png"
              alt="Start Adventure"
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg max-w-sm mx-auto block"
            />
          </motion.div>
        </form>

        {/* Mensaje inferior */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <p className="text-gray-300 text-sm font-semibold drop-shadow-lg">Join Kokok on his epic flight adventure</p>
        </motion.div>
      </div>
    </div>
  )
}
