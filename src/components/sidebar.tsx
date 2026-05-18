type SidebarProps = {
  isOpen: boolean
}

function Sidebar({ isOpen }: SidebarProps) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <h2>Jogos</h2>
            <ul>
                <li className="active">Jogo 1</li>
                <li>Jogo 2</li>
                <li>Jogo 3</li>
            </ul>
        </aside>
    );
}

export default Sidebar;