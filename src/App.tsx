import {useState, type FormEvent } from 'react'
import Header from './components/header'
import Footer from './components/footer'
import Sidebar from './components/sidebar'
import CrashGame from './components/CrashGame'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [walletBalance, setWalletBalance] = useState(100.00)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const openLoginModal = () => {
    setIsLoginOpen(true)
    setLoginMessage(null)
    setLoginPassword('')
  }

  const closeLoginModal = () => {
    setIsLoginOpen(false)
    setLoginMessage(null)
    setLoginPassword('')
  }

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loginUsername || !loginPassword) {
      setLoginMessage('Preencha usuário e senha para continuar.')
      return
    }

    setIsLoginLoading(true)
    setLoginMessage(null)

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserId(data.userId)
        setUsername(data.username)
        if (data.balance !== undefined && data.balance !== null) {
          setWalletBalance(Number(data.balance))
        }
        setLoginMessage('Login realizado com sucesso!')
        setTimeout(closeLoginModal, 1200)
      } else {
        const errorText = await response.text()
        setLoginMessage(`Usuário ou senha inválidos. ${errorText}`)
      }
    } catch (error) {
      console.error('Erro ao conectar com o backend:', error)
      setLoginMessage('Erro de conexão com o backend. Verifique se o servidor está rodando.')
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="app-container">
      <Header onMenuToggle={toggleSidebar} walletBalance={walletBalance} onLogin={openLoginModal} />

      {isLoginOpen && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="login-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Entrar</h2>
                <p>Use seu usuário e senha para acessar.</p>
              </div>
              <button className="modal-close" onClick={closeLoginModal} type="button">
                ×
              </button>
            </div>

            <form className="login-form" onSubmit={handleLoginSubmit}>
              <label>
                Usuário
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                />
              </label>

              <label>
                Senha
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </label>

              <button className="login-submit" type="submit" disabled={isLoginLoading}>
                {isLoginLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {loginMessage && <p className="login-message">{loginMessage}</p>}
          </div>
        </div>
      )}

      <div className="app-layout">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="app-content">
          <CrashGame balance={walletBalance} setBalance={setWalletBalance} userId={userId} username={username} />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
