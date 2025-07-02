"use client"

interface ObstacleProps {
  x: number
  y: number
  width: number
  height: number
  type: "building" | "asteroid"
}

export default function Obstacle({ x, y, width, height, type }: ObstacleProps) {
  return (
    <div
      className={`absolute ${
        type === "building"
          ? "bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-500"
          : "bg-gradient-to-br from-orange-500 to-red-600 rounded-full border-2 border-yellow-400"
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  )
}
