import { useState } from 'react'
import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/sidebar'
import Panel from './components/panel'
import Card from './components/card'
import BlackjackGame from './components/blackjack'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className="app-content">
          <Panel gameName="Blackjack 21" />
          <BlackjackGame />
          <div className="feature-grid">
            <Card
              title="Regras básicas"
              description="A soma das cartas deve chegar o mais perto possível de 21 sem passar. A carta do dealer fica oculta até você parar."
              badge="Jogo"
            />
            <Card
              title="Estado e interações"
              description="Use estado, efeitos e props para controlar o fluxo do jogo e manter o front-end preparado para integrar com o backend."
            />
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
