import React from 'react'

interface Props {
  lastDigits: string
}

const PaymentSystemIcon: React.FC = () => (
  <svg
    className="db"
    width="28"
    height="18"
    viewBox="0 0 28 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.1739 17.9555H1.82609C0.817478 17.9555 0 17.2621 0 16.4065V1.94937C0 1.09382 0.817478 0.400391 1.82609 0.400391H26.1739C27.1825 0.400391 28 1.09382 28 1.94937V16.4065C28 17.2621 27.1825 17.9555 26.1739 17.9555Z"
      fill="#CACBCC"
    />
    <path d="M28 3.91113H0V7.42216H28V3.91113Z" fill="#727273" />
    <path
      d="M13.1222 10.9336H2.62775C2.14298 10.9336 1.75 11.3266 1.75 11.8113C1.75 12.2961 2.14298 12.6891 2.62775 12.6891H13.1222C13.607 12.6891 14 12.2961 14 11.8113C14 11.3266 13.607 10.9336 13.1222 10.9336Z"
      fill="#727273"
    />
  </svg>
)
const SavedCard: React.FC<Props> = ({ lastDigits }) => {
  return (
    <div className="flex">
      <PaymentSystemIcon />
      <div className="ml5">Cartão de Crédito final {lastDigits} </div>
    </div>
  )
}

export default SavedCard
