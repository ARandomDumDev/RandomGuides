"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, RotateCcw, Play, Pause, Gamepad2 } from "lucide-react"
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
      ball: { x: 400, y: 200, dx: 4, dy: 4, radius: 10 },
      player: { x: 20, y: 150, width: 12, height: 100, speed: 6 },
      computer: { x: 768, y: 150, width: 12, height: 100, speed: 4 },
      canvas: { width: 800, height: 400 },
    }

    // Set canvas size
    canvas.width = game.canvas.width
    canvas.height = game.canvas.height

    // Game loop
    const gameLoop = () => {
      if (gameState !== "playing") return

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#1e1b4b")
      gradient.addColorStop(1, "#312e81")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw center line with glow effect
      ctx.save()
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.shadowColor = "#8b5cf6"
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

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

      // Draw paddles with glow effect
      ctx.save()
      ctx.shadowBlur = 15

      // Player paddle
      ctx.shadowColor = "#8b5cf6"
      ctx.fillStyle = "#8b5cf6"
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height)

      // Computer paddle
      ctx.shadowColor = "#ec4899"
      ctx.fillStyle = "#ec4899"
      ctx.fillRect(game.computer.x, game.computer.y, game.computer.width, game.computer.height)

      ctx.restore()

      // Draw ball with glow effect
      ctx.save()
      ctx.shadowColor = "#06b6d4"
      ctx.shadowBlur = 20
      ctx.beginPath()
      ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = "#06b6d4"
      ctx.fill()
      ctx.restore()

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 animate-fade-in">
      <div className="text-center space-y-8 max-w-4xl w-full">
        <div className="space-y-4 animate-slide-in-up">
          <div className="relative">
            <h1 className="text-9xl font-bold text-white opacity-20 animate-pulse-subtle">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-cyan-400 animate-bounce-subtle" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white gradient-text">Page Not Found</h2>
          <p className="text-xl text-gray-300">Oops! The page you're looking for doesn't exist.</p>
          <p className="text-lg text-gray-400">But hey, want to play some ping pong while you're here?</p>
        </div>

        <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm rounded-2xl shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-t-2xl">
            <CardTitle className="text-white flex items-center justify-between text-2xl">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-cyan-400" />
                <span>Retro Ping Pong</span>
              </div>
              <div className="text-lg font-mono bg-slate-700/50 px-4 py-2 rounded-lg">
                <span className="text-violet-400">{score.player}</span>
                <span className="text-gray-400 mx-2">:</span>
                <span className="text-fuchsia-400">{score.computer}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-slate-600 rounded-xl cursor-none shadow-2xl w-full max-w-3xl mx-auto"
                style={{ maxWidth: "100%", height: "auto", aspectRatio: "2/1" }}
              />
              {gameState === "stopped" && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                  <div className="text-center space-y-4">
                    <Gamepad2 className="h-12 w-12 text-cyan-400 mx-auto animate-bounce" />
                    <p className="text-white text-lg">Click Play to start the game!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                onClick={() => setGameState(gameState === "playing" ? "paused" : "playing")}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {gameState === "playing" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {gameState === "playing" ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">🖱️ Move your mouse to control the left paddle</p>
              <p className="text-xs text-gray-500">First to 10 points wins!</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center flex-wrap animate-fade-in-delay">
          <Button
            asChild
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
