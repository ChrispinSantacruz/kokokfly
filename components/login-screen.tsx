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
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url('/images/login1.png')` }}
    >
      {/* Logo positioned in the white rectangle area */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute text-center"
        style={{
          top: "20vh",
          left: "18%",
          transform: "translateX(-50%)",
          width: "65vw",
        }}
      >
        <img 
          src="/images/logo.png" 
          alt="KOKOK THE ROACH Logo"
          className="w-auto h-40 mx-auto drop-shadow-2xl"
        />
      </motion.div>

      {/* Form positioned exactly where the interface rectangles are */}
      <form onSubmit={handleSubmit}>
        {/* Name input positioned in the blue rectangle area */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute"
          style={{
            top: "46vh",
            left: "38%",
            transform: "translateX(-50%)",
            width: "25vw",
            minWidth: "400px",
          }}
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-transparent border-2 border-cyan-400/80 text-white placeholder-gray-300 focus:border-yellow-400 focus:ring-yellow-400/50 rounded-xl h-16 text-lg font-semibold backdrop-blur-sm shadow-lg w-full"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-sm mt-1 font-semibold drop-shadow text-center">{errors.name}</p>
          )}
        </motion.div>

        {/* Start Adventure button positioned in the yellow rectangle area */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute"
          style={{
            top: "62vh",
            left: "37.5%",
            transform: "translateX(-50%)",
            width: "25vw",
            minWidth: "400px",
          }}
        >
          <img
            src="/images/buttons/start.png"
            alt="Start Adventure"
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            className="w-full h-auto cursor-pointer transform hover:scale-105 transition-all duration-200 drop-shadow-lg"
          />
        </motion.div>
      </form>

      {/* Bottom message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute text-center"
        style={{
          bottom: "21vh",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <p className="text-gray-300 text-sm font-semibold drop-shadow-lg">Join Kokok on his epic flight adventure</p>
      </motion.div>
    </div>
  )
}
