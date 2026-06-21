type HeaderProps = {
  onMenuToggle: () => void
  walletBalance: number
  onLogin: () => void
}

function Header({ onMenuToggle, walletBalance, onLogin }: HeaderProps) {
    return(
        <header className="header">
            <button className="menu-toggle" onClick={onMenuToggle}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className="brand">
                <span className="logo">J</span>
                <div>
                    <strong>Jogos Educativos</strong>
                </div>
            </div>
            <div className="header-right">
              <span className="header-wallet">Saldo: R$ {walletBalance.toFixed(2)}</span>
              <button className="header-login" onClick={onLogin}>Login</button>
            </div>
        </header>
    )
}

export default Header;