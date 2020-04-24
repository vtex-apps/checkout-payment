import React, { ReactNode } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { GroupOption, ListGroup } from 'vtex.checkout-components'
import { AvailableAccount } from 'vtex.checkout-graphql'
import { PaymentFlagPicker } from 'vtex.payment-flags'

import Header from './components/Header'

const messages = defineMessages({
  choosePaymentMethod: {
    id: 'checkout-payment.choosePaymentMethodLabel',
  },
  creditCardLabel: {
    id: 'checkout-payment.creditCardLabel',
  },
  newCreditCardLabel: {
    id: 'checkout-payment.newCreditCardLabel',
  },
})

const PaymentItem: React.FC<{
  paymentSystem?: string
  label: ReactNode
}> = ({ paymentSystem = '', label }) => {
  return (
    <div className="flex items-center c-muted-1">
      <PaymentFlagPicker paymentSystem={paymentSystem}>
        {FlagComponent =>
          FlagComponent && (
            <div className="h2">
              <FlagComponent />
            </div>
          )
        }
      </PaymentFlagPicker>
      <span className="ml5">{label}</span>
    </div>
  )
}

interface Props {
  newCreditCard: () => void
}

const PaymentList: React.FC<Props> = ({ newCreditCard }) => {
  const intl = useIntl()
  const {
    orderForm: {
      paymentData: { availableAccounts },
    },
  } = useOrderForm()
  return (
    <div>
      <Header>{intl.formatMessage(messages.choosePaymentMethod)}</Header>
      <ListGroup>
        {availableAccounts.map((payment: AvailableAccount) => {
          const lastDigits = payment.cardNumber.replace(/[^\d]/g, '')
          const paymentLabel = (
            <>
              {intl.formatMessage(messages.creditCardLabel)} &middot; &middot;
              &middot; &middot;{lastDigits}
            </>
          )
          return (
            <GroupOption key={payment.accountId}>
              <PaymentItem
                paymentSystem={payment.paymentSystem}
                label={paymentLabel}
              />
            </GroupOption>
          )
        })}
        <GroupOption onClick={newCreditCard}>
          <PaymentItem
            label={intl.formatMessage(messages.newCreditCardLabel)}
          />
        </GroupOption>
      </ListGroup>
    </div>
  )
}

export default PaymentList
