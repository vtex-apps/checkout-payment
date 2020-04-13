import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { useIntl, defineMessages } from 'react-intl'

import InstallmentItem from './InstallmentItem'
import CardSummary from './CardSummary'

const messages = defineMessages({
  paymentMethodLabel: {
    id: 'checkout-payment.paymentMethodLabel',
  },
})

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
  const intl = useIntl()

  const {
    orderForm: {
      paymentData: { installmentOptions },
    },
  } = useOrderForm()

  const installmentOption = installmentOptions.find(
    ({ paymentSystem }: InstallmentOption) =>
      paymentSystem === selectedPaymentSystem
  )

  const { installments } = installmentOption!

  return (
    <div>
      <CardSummary
        lastDigits={lastDigits}
        paymentSystem={selectedPaymentSystem}
        handleClick={backToCreditCard}
      />
      <div className="fw6 mt6 bb b--muted-4 pb5">
        {intl.formatMessage(messages.paymentMethodLabel)}
      </div>
      <div>
        {installments.map((installment: Installment) => {
          return (
            <InstallmentItem
              key={`${installment.count}`}
              installment={installment}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Installments
