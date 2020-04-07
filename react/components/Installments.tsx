import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

import InstallmentItem from './InstallmentItem'
import CardSummary from './CardSummary'

interface Props {
  paymentSystem: string
  lastDigits: string
}
const Installments: React.FC<Props> = ({
  paymentSystem: selectedPaymentSystem,
  lastDigits,
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
      />
      <div className="fw6 mt6">Choose a payment method</div>
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
