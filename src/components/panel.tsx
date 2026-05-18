type PanelProps = {
  gameName: string
}

function Panel({ gameName }: PanelProps) {
    return (
        <section className="panel">
            <div className="panel-header">
                <div>
                    <span className="eyebadge">Atividade</span>
                    <h1>Bem-vindo ao {gameName}</h1>
                </div>
                <span className="status">Online</span>
            </div>
            <p className="panel-description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae saepe architecto aut quaerat? Quo iure dolorem rerum assumenda? Illo pariatur possimus est asperiores aliquid quis voluptatum velit vitae nobis sint!
            </p>
            <div className="panel-actions">
                <button>Continuar</button>
                <button className="secondary">Ver instruções</button>
            </div>
        </section>
    );
}

export default Panel;