type CardProps = {
  title: string
  description: string
  badge?: string
}

function Card({ title, description, badge }: CardProps) {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <button className="card-button">Começar</button>
    </article>
  )
}

export default Card;
