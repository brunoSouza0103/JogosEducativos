type HeaderProps = {
  onMenuToggle: () => void
}

function Header({ onMenuToggle }: HeaderProps) {
    return(
        <header className="header">
            <button className="menu-toggle" onClick={onMenuToggle} title="Abrir/fechar menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className="brand">
                <span className="logo">J</span>
                <div>
                    <strong>Jogos Educativos</strong>
                    <p>Sistema de aprendizagem interativa</p>
                </div>
            </div>
            <nav className="menu">
                <ul>
                    <li><a href="#home">Início</a></li>
                    <li><a href="#recursos">Recursos</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;