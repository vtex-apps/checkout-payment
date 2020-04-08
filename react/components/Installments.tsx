import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import InstallmentItem from './InstallmentItem'
import CardSummary from './CardSummary'

interface Props {
  paymentSystem: string
  lastDigits: string
  backToCreditCard: () => void
}
const Installments: React.FC<Props> = ({
  paymentSystem: selectedPaymentSystem,
  lastDigits,
  backToCreditCard,
}) => {
  const {
    orderForm: {
      paymentData: { installmentOptions },
    },
  } = useOrderForm()

  const installmentOption = installmentOptions.find(
    ({ paymentSystem }: any) => paymentSystem === selectedPaymentSystem
  )

  const { installments } = installmentOption

  return (
    <div>
      <CardSummary
        lastDigits={lastDigits}
        paymentSystem={selectedPaymentSystem}
        handleClick={backToCreditCard}
      />
      <div className="fw6 mt6 bb b--muted-4 pb5">
        Escola um método de pagamento
      </div>
      <div>
        {installments.map((installment: any) => {
          return (
            <InstallmentItem
              key={installment.count}
              installment={installment}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Installments
