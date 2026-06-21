import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from 'react'
import './CrashGame.css'

type GameState = 'idle' | 'playing' | 'crashed' | 'won'

interface BetResult {
  betAmount: number
  multiplier: number
  winAmount: number
  result: 'won' | 'lost'
}

type CrashGameProps = {
  balance: number
  setBalance: Dispatch<SetStateAction<number>>
  userId: number | null
  username: string | null
}

function CrashGame({ balance, setBalance, userId, username }: CrashGameProps) {
  
  // Estado do jogo
  const [gameState, setGameState] = useState<GameState>('idle')
  const [multiplier, setMultiplier] = useState(1.0)
  const [betAmount, setBetAmount] = useState('')
  const [crashPoint, setCrashPoint] = useState(0)
  const [history, setHistory] = useState<BetResult[]>([])
  const [message, setMessage] = useState('')
  
  // Referências
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const betIdRef = useRef<number | null>(null)

  // Desenha o gráfico
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpa canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i
      const y = (canvas.height / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Desenha a linha do multiplicador
    if (gameState !== 'idle') {
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 3
      ctx.beginPath()

      const maxMultiplier = Math.max(multiplier, 10)
      const startX = 0
      const startY = canvas.height
      const endX = canvas.width
      const endY = canvas.height - ((multiplier - 1) / (maxMultiplier - 1)) * canvas.height

      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Se o jogo crashou, desenha linha vermelha
      if (gameState === 'crashed') {
        const crashX = (canvas.width / 100) * 50
        ctx.strokeStyle = '#ff0000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(crashX, 0)
        ctx.lineTo(crashX, canvas.height)
        ctx.stroke()

        ctx.fillStyle = '#ff0000'
        ctx.font = 'bold 24px Arial'
        ctx.fillText('CRASHED!', 20, 50)
      }
    }

    // Texto do multiplicador
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 48px Arial'
    ctx.fillText(`${multiplier.toFixed(2)}x`, 20, 80)
  }, [gameState, multiplier, crashPoint])

  // Loop do jogo
  useEffect(() => {
    if (gameState !== 'playing' || !betIdRef.current) return

    let cancelled = false

    const poll = async () => {
      try {
        const res = await fetch(`/api/game/status?betId=${betIdRef.current}`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const serverMultiplier = Number(data.multiplier) || 1
        setMultiplier(serverMultiplier)
        if (data.status === 'crashed') {
          setGameState('crashed')
          setMessage('Crashou!')
          recordBet('lost', Number(data.multiplier))
        }
        if (data.status === 'won') {
          setGameState('won')
          setMessage('Ganhou!')
          recordBet('won', Number(data.multiplier))
        }
      } catch (e) {
      }
      if (!cancelled) setTimeout(poll, 500)
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'playing') return

    startTimeRef.current = performance.now()
    let frameId = 0

    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000
      const currentMultiplier = Math.exp(0.15 * elapsed)
      setMultiplier(currentMultiplier)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [gameState])

  const recordBet = (result: 'won' | 'lost', finalMultiplier: number) => {
    const bet = parseFloat(betAmount)
    const winAmount = result === 'won' ? bet * finalMultiplier : 0

    const newBet: BetResult = {
      betAmount: bet,
      multiplier: finalMultiplier,
      winAmount: winAmount,
      result: result
    }

    setHistory([newBet, ...history].slice(0, 10))
  }

  const startGame = async () => {
    if (!userId) {
      setMessage('Faça login para jogar')
      return
    }
    const bet = parseFloat(betAmount)
    if (!betAmount || bet <= 0) {
      setMessage('Insira uma aposta válida')
      return
    }
    if (bet > balance) {
      setMessage('Saldo insuficiente')
      return
    }
    try {
      const res = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, amount: bet })
      })
      if (!res.ok) {
        setMessage('Não foi possível iniciar o jogo')
        return
      }
      const data = await res.json()
      setBalance(Number(data.balance))
      setGameState('playing')
      setMultiplier(1.0)
      setMessage('Jogo iniciado!')
      betIdRef.current = data.betId
    } catch (e) {
      setMessage('Erro de rede')
    }
  }

  const cashOut = async () => {
    if (gameState !== 'playing') return
    if (!betIdRef.current) return

    try {
      const res = await fetch('/api/game/cashout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, betId: betIdRef.current })
      })
      if (!res.ok) {
        setMessage('Falha no saque')
        return
      }
      const data = await res.json()
      const newBalance = typeof data.balance === 'number' ? data.balance : Number(data.balance)
      if (!Number.isNaN(newBalance)) {
        setBalance(newBalance)
      }
      if (data.won) {
        setGameState('won')
        setMessage(`Sacou! Ganhou R$ ${(Number(data.amount) * Number(data.multiplier)).toFixed(2)}`)
        recordBet('won', Number(data.multiplier))
      } else {
        setGameState('crashed')
        setMessage('Crashou!')
        recordBet('lost', Number(data.multiplier))
      }
    } catch (e) {
      setMessage('Erro de rede')
    }
  }

  const resetGame = () => {
    setGameState('idle')
    setMultiplier(1.0)
    setMessage('')
    setCrashPoint(0)
    setBetAmount('')
    betIdRef.current = null
  }

  return (
    <div className="crash-game-container">
      {username && (
        <div style={{ padding: '10px', textAlign: 'center', color: '#00ff00', marginBottom: '10px' }}>
          Logado como: <strong>{username}</strong>
        </div>
      )}
      {!username && (
        <div style={{ padding: '10px', textAlign: 'center', color: '#ff6666', marginBottom: '10px' }}>
          Faça login para jogar
        </div>
      )}
      <div className="game-board">
        <div className="game-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="game-canvas"
          />
        </div>

        <div className="game-controls">
          <div className="control-section">
            <label>Valor da Aposta (R$)</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="Insira o valor"
              disabled={gameState !== 'idle'}
              min="1"
              step="0.01"
            />
          </div>

          <div className="button-group">
            {gameState === 'idle' && (
              <button className="btn btn-play" onClick={startGame}>
                Iniciar Jogo
              </button>
            )}
            {gameState === 'playing' && (
              <button className="btn btn-cashout" onClick={cashOut}>
                Sacar {(parseFloat(betAmount) * multiplier).toFixed(2)}
              </button>
            )}
            {(gameState === 'crashed' || gameState === 'won') && (
              <button className="btn btn-reset" onClick={resetGame}>
                Novo Jogo
              </button>
            )}
          </div>

          {message && <div className="game-message">{message}</div>}
        </div>
      </div>

      <div className="game-history">
        <h3>Histórico</h3>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty">Nenhuma aposta realizada</p>
          ) : (
            history.map((bet, idx) => (
              <div key={idx} className={`history-item ${bet.result}`}>
                <span className="hist-bet">R$ {bet.betAmount.toFixed(2)}</span>
                <span className="hist-mult">{bet.multiplier.toFixed(2)}x</span>
                <span className="hist-result">
                  {bet.result === 'won' ? `+R$ ${bet.winAmount.toFixed(2)}` : 'Perdeu'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CrashGame
