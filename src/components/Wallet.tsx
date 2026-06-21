type WalletProps = {
  balance: number
}

function Wallet({ balance }: WalletProps) {
  return (
    <div className="wallet">
      <div className="wallet-card">
        <div className="wallet-label">Saldo Disponível</div>
        <div className="wallet-amount">
          R$ {balance.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default Wallet
