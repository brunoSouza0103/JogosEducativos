import { useState } from 'react'
import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/sidebar'
import Panel from './components/panel'
import Card from './components/card'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className="app-content">
          <Panel gameName="Jogo 1" />
          <div className="feature-grid">
            <Card
              title="Desafios Educativos"
              description="Explore atividades criativas e didáticas para tornar o aprendizado mais divertido e acessível."
              badge="Novo"
            />
            <Card
              title="Progresso do Aluno"
              description="Acompanhe o desenvolvimento em tempo real com indicadores claros e fáceis de usar."
            />
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
