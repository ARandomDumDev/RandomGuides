"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, RotateCcw, Play, Pause } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"playing" | "paused" | "stopped">("stopped")
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const gameRef = useRef<any>(null)

  useEffect(() => {
    if (gameState === "playing") {
      startGame()
    } else {
      stopGame()
    }

    return () => stopGame()
  }, [gameState])

  const startGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game objects
    const game = {
      ball: { x: 400, y: 200, dx: 4, dy: 4, radius: 8 },
      player: { x: 20, y: 150, width: 10, height: 100, speed: 6 },
      computer: { x: 770, y: 150, width: 10, height: 100, speed: 4 },
      canvas: { width: 800, height: 400 },
    }

    // Set canvas size
    canvas.width = game.canvas.width
    canvas.height = game.canvas.height

    // Game loop
    const gameLoop = () => {
      if (gameState !== "playing") return

      // Clear canvas
      ctx.fillStyle = "#1e293b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw center line
      ctx.setLineDash([5, 15])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.strokeStyle = "#475569"
      ctx.stroke()
      ctx.setLineDash([])

      // Move ball
      game.ball.x += game.ball.dx
      game.ball.y += game.ball.dy

      // Ball collision with top/bottom
      if (game.ball.y <= game.ball.radius || game.ball.y >= canvas.height - game.ball.radius) {
        game.ball.dy = -game.ball.dy
      }

      // Ball collision with paddles
      if (
        game.ball.x <= game.player.x + game.player.width &&
        game.ball.y >= game.player.y &&
        game.ball.y <= game.player.y + game.player.height
      ) {
        game.ball.dx = -game.ball.dx
        game.ball.x = game.player.x + game.player.width + game.ball.radius
      }

      if (
        game.ball.x >= game.computer.x - game.ball.radius &&
        game.ball.y >= game.computer.y &&
        game.ball.y <= game.computer.y + game.computer.height
      ) {
        game.ball.dx = -game.ball.dx
        game.ball.x = game.computer.x - game.ball.radius
      }

      // Score
      if (game.ball.x < 0) {
        setScore((prev) => ({ ...prev, computer: prev.computer + 1 }))
        resetBall()
      }
      if (game.ball.x > canvas.width) {
        setScore((prev) => ({ ...prev, player: prev.player + 1 }))
        resetBall()
      }

      // Computer AI
      const computerCenter = game.computer.y + game.computer.height / 2
      if (computerCenter < game.ball.y - 35) {
        game.computer.y += game.computer.speed
      } else if (computerCenter > game.ball.y + 35) {
        game.computer.y -= game.computer.speed
      }

      // Keep computer paddle in bounds
      game.computer.y = Math.max(0, Math.min(canvas.height - game.computer.height, game.computer.y))

      // Draw paddles
      ctx.fillStyle = "#8b5cf6"
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height)
      ctx.fillStyle = "#ec4899"
      ctx.fillRect(game.computer.x, game.computer.y, game.computer.width, game.computer.height)

      // Draw ball
      ctx.beginPath()
      ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      requestAnimationFrame(gameLoop)
    }

    const resetBall = () => {
      game.ball.x = canvas.width / 2
      game.ball.y = canvas.height / 2
      game.ball.dx = Math.random() > 0.5 ? 4 : -4
      game.ball.dy = Math.random() > 0.5 ? 4 : -4
    }

    // Mouse controls
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseY = e.clientY - rect.top
      game.player.y = mouseY - game.player.height / 2
      game.player.y = Math.max(0, Math.min(canvas.height - game.player.height, game.player.y))
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    gameRef.current = { gameLoop, handleMouseMove }

    gameLoop()
  }

  const stopGame = () => {
    if (gameRef.current?.handleMouseMove) {
      canvasRef.current?.removeEventListener("mousemove", gameRef.current.handleMouseMove)
    }
  }

  const resetGame = () => {
    setScore({ player: 0, computer: 0 })
    setGameState("stopped")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-white opacity-20">404</h1>
          <h2 className="text-4xl font-bold text-white">Page Not Found</h2>
          <p className="text-xl text-gray-300">Oops! The page you're looking for doesn't exist.</p>
          <p className="text-lg text-gray-400">But hey, want to play some ping pong while you're here?</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Ping Pong Game</span>
              <div className="text-sm font-mono">
                You: {score.player} | Computer: {score.computer}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <canvas
              ref={canvasRef}
              className="border border-slate-600 rounded-lg cursor-none"
              style={{ maxWidth: "100%", height: "auto" }}
            />

            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setGameState(gameState === "playing" ? "paused" : "playing")}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {gameState === "playing" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {gameState === "playing" ? "Pause" : "Play"}
              </Button>
              <Button onClick={resetGame} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <p className="text-sm text-gray-400">Move your mouse to control the left paddle</p>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
