import React, { ReactNode } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { GroupOption, ListGroup } from 'vtex.checkout-components'
import { AvailableAccount } from 'vtex.checkout-graphql'
import { PaymentFlag } from 'vtex.payment-flags'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

import Header from './components/Header'
import CardLabel from './components/CardLabel'

const messages = defineMessages({
  choosePaymentMethod: {
    id: 'store/checkout-payment.choosePaymentMethodLabel',
  },
  creditCardLabel: {
    id: 'store/checkout-payment.creditCardLabel',
  },
  newCreditCardLabel: {
    id: 'store/checkout-payment.newCreditCardLabel',
  },
})

const PaymentItem: React.FC<{
  paymentSystem?: string
  label: ReactNode
}> = ({ paymentSystem = '', label }) => {
  return (
    <div className="flex items-center c-muted-1">
      <div className="h2">
        <PaymentFlag paymentSystemId={paymentSystem} />
      </div>
      <span className="ml5">{label}</span>
    </div>
  )
}

interface Props {
  onNewCreditCard: () => void
  onSavedCreditCard: (payment: AvailableAccount) => void
}

const PaymentList: React.FC<Props> = ({
  onNewCreditCard,
  onSavedCreditCard,
}) => {
  const intl = useIntl()

  const { availableAccounts } = useOrderPayment()

  return (
    <div>
      <Header>{intl.formatMessage(messages.choosePaymentMethod)}</Header>

      <ListGroup>
        {availableAccounts.map((payment: AvailableAccount) => {
          const lastDigits = payment.cardNumber.replace(/[^\d]/g, '')
          const paymentLabel = (
            <CardLabel
              label={intl.formatMessage(messages.creditCardLabel)}
              lastDigits={lastDigits}
            />
          )
          return (
            <GroupOption
              onClick={() => onSavedCreditCard(payment)}
              key={payment.accountId}
              caretAlign="center"
            >
              <PaymentItem
                paymentSystem={payment.paymentSystem}
                label={paymentLabel}
              />
            </GroupOption>
          )
        })}
        <GroupOption onClick={onNewCreditCard} caretAlign="center">
          <PaymentItem
            label={intl.formatMessage(messages.newCreditCardLabel)}
          />
        </GroupOption>
      </ListGroup>
    </div>
  )
}

export default PaymentList
