import { useEffect, useMemo, useState } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'

type BlackjackCard = {
  rank: string
  suit: Suit
  value: number
  code: string
}

type GamePhase = 'idle' | 'playing' | 'dealer-turn' | 'finished'

const suits: Suit[] = ['♠', '♥', '♦', '♣']
const ranks = [
  { rank: 'A', value: 11 },
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 10 },
  { rank: 'Q', value: 10 },
  { rank: 'K', value: 10 }
]

function createDeck(): BlackjackCard[] {
  return suits.flatMap((suit) =>
    ranks.map((card) => ({
      rank: card.rank,
      suit,
      value: card.value,
      code: `${card.rank}${suit}`
    }))
  )
}

function shuffleDeck(deck: BlackjackCard[]): BlackjackCard[] {
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function calculateTotal(hand: BlackjackCard[]) {
  let total = hand.reduce((sum, card) => sum + card.value, 0)
  let aceCount = hand.filter((card) => card.rank === 'A').length

  while (total > 21 && aceCount > 0) {
    total -= 10
    aceCount -= 1
  }

  return total
}

function formatHandValue(hand: BlackjackCard[]) {
  if (hand.length === 0) {
    return '0'
  }
  return String(calculateTotal(hand))
}

function HandSection({
  title,
  hand,
  hideFirstCard = false,
  total
}: {
  title: string
  hand: BlackjackCard[]
  hideFirstCard?: boolean
  total: number | string
}) {
  return (
    <div className="hand-card">
      <div className="hand-card-header">
        <strong>{title}</strong>
        <span>{total}</span>
      </div>
      <div className="hand-cards">
        {hand.map((card, index) => (
          <div
            key={card.code + index}
            className={`playing-card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}`}
          >
            <span className="card-rank">{hideFirstCard && index === 0 ? '🂠' : card.rank}</span>
            <span className="card-suit">{hideFirstCard && index === 0 ? '' : card.suit}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlackjackGame() {
  const [deck, setDeck] = useState<BlackjackCard[]>([])
  const [playerHand, setPlayerHand] = useState<BlackjackCard[]>([])
  const [dealerHand, setDealerHand] = useState<BlackjackCard[]>([])
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [message, setMessage] = useState('Clique em Iniciar para começar a jogar Blackjack.')
  const [dealerHidden, setDealerHidden] = useState(true)

  const playerTotal = useMemo(() => calculateTotal(playerHand), [playerHand])
  const dealerTotal = useMemo(() => calculateTotal(dealerHand), [dealerHand])

  useEffect(() => {
    setDeck(shuffleDeck(createDeck()))
  }, [])

  useEffect(() => {
    if (phase === 'dealer-turn') {
      setDealerHidden(false)
      const timer = window.setTimeout(() => {
        if (dealerTotal < 17) {
          drawDealerCard()
        } else {
          finishRound()
        }
      }, 700)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [phase, dealerHand])

  useEffect(() => {
    if (phase !== 'playing') {
      return
    }
    if (playerTotal > 21) {
      setPhase('finished')
      setDealerHidden(false)
      setMessage('Você estourou! O dealer vence desta vez. 👍')
    }
  }, [playerTotal, phase])

  function dealCards(currentDeck: BlackjackCard[]) {
    const first = currentDeck[0]
    const second = currentDeck[1]
    const third = currentDeck[2]
    const fourth = currentDeck[3]
    setPlayerHand([first, third])
    setDealerHand([second, fourth])
    setDeck(currentDeck.slice(4))
  }

  function drawCard(fromDeck: BlackjackCard[]) {
    const [next, ...rest] = fromDeck
    return { next, rest }
  }

  function startGame() {
    const freshDeck = shuffleDeck(createDeck())
    setMessage('Jogo iniciado! Sua vez de agir.')
    setPhase('playing')
    setDealerHidden(true)
    setPlayerHand([])
    setDealerHand([])
    dealCards(freshDeck)
  }

  function drawPlayerCard() {
    if (phase !== 'playing' || deck.length === 0) {
      return
    }
    const { next, rest } = drawCard(deck)
    if (!next) {
      return
    }
    setPlayerHand((current) => [...current, next])
    setDeck(rest)
  }

  function drawDealerCard() {
    if (deck.length === 0) {
      finishRound()
      return
    }
    const { next, rest } = drawCard(deck)
    if (!next) {
      finishRound()
      return
    }
    setDealerHand((current) => [...current, next])
    setDeck(rest)
  }

  function stand() {
    if (phase !== 'playing') {
      return
    }
    setPhase('dealer-turn')
    setMessage('Dealer jogando... Aguarde o resultado.')
  }

  function finishRound() {
    setDealerHidden(false)
    setPhase('finished')

    if (dealerTotal > 21) {
      setMessage('Dealer estourou! Você ganhou. 🎉')
      return
    }

    if (playerTotal > 21) {
      setMessage('Você estourou! O dealer venceu.')
      return
    }

    if (dealerTotal >= playerTotal) {
      setMessage('Dealer vence! Tente de novo para bater 21.')
      return
    }

    setMessage('Parabéns, você venceu! Excelente jogada.')
  }

  function resetGame() {
    setPhase('idle')
    setMessage('Clique em Iniciar para começar a jogar Blackjack.')
    setPlayerHand([])
    setDealerHand([])
    setDeck(shuffleDeck(createDeck()))
    setDealerHidden(true)
  }

  function actionLabel() {
    if (phase === 'idle') {
      return 'Iniciar jogo'
    }
    if (phase === 'playing') {
      return 'Bater'
    }
    if (phase === 'dealer-turn') {
      return 'Aguardando...'
    }
    return 'Reiniciar'
  }

  return (
    <section className="blackjack-board">
      <div className="blackjack-intro">
        <div>
          <span className="eyebadge">Blackjack</span>
          <h2>Jogo de 21</h2>
          <p>
            Use os botões para iniciar, bater ou parar. O jogo calcula as cartas do dealer e atualiza o resultado
            automaticamente.
          </p>
        </div>
        <div className="blackjack-status">
          <p>{message}</p>
          <div className="blackjack-metrics">
            <span>{`Mão do jogador: ${playerHand.length} cartas`}</span>
            <span>{`Mão do dealer: ${dealerHand.length} cartas`}</span>
          </div>
        </div>
      </div>

      <div className="blackjack-table">
        <HandSection title="Dealer" hand={dealerHand} hideFirstCard={dealerHidden && phase !== 'finished'} total={dealerHidden && phase !== 'finished' ? '??' : dealerTotal} />
        <HandSection title="Jogador" hand={playerHand} total={playerTotal} />
      </div>

      <div className="game-actions">
        {phase === 'idle' && (
          <button className="primary" onClick={startGame}>Iniciar jogo</button>
        )}
        {phase === 'playing' && (
          <>
            <button className="primary" onClick={drawPlayerCard}>Bater</button>
            <button className="secondary" onClick={stand}>Parar</button>
          </>
        )}
        {phase === 'finished' && (
          <button className="primary" onClick={resetGame}>Reiniciar jogo</button>
        )}
      </div>
    </section>
  )
}

export default BlackjackGame
