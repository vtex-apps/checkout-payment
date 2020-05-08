import React, { ReactNode } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { GroupOption, ListGroup } from 'vtex.checkout-components'
import { AvailableAccount } from 'vtex.checkout-graphql'
import { PaymentFlagPicker } from 'vtex.payment-flags'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

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
  editCard: () => void
}

const PaymentList: React.FC<Props> = ({ newCreditCard, editCard }) => {
  const intl = useIntl()

  const { cardFormData, availableAccounts } = useOrderPayment()

  return (
    <div>
      <Header>{intl.formatMessage(messages.choosePaymentMethod)}</Header>

      <ListGroup>
        {cardFormData && (
          <GroupOption onClick={editCard} caretAlign="center">
            <PaymentItem
              label={
                <>
                  Cartão incompleto &middot; &middot; &middot; &middot;
                  {cardFormData.lastDigits}
                </>
              }
            />
          </GroupOption>
        )}
        {availableAccounts.map((payment: AvailableAccount) => {
          const lastDigits = payment.cardNumber.replace(/[^\d]/g, '')
          const paymentLabel = (
            <>
              {intl.formatMessage(messages.creditCardLabel)} &middot; &middot;
              &middot; &middot;{lastDigits}
            </>
          )
          return (
            <GroupOption key={payment.accountId} caretAlign="center">
              <PaymentItem
                paymentSystem={payment.paymentSystem}
                label={paymentLabel}
              />
            </GroupOption>
          )
        })}
        <GroupOption onClick={newCreditCard} caretAlign="center">
          <PaymentItem
            label={intl.formatMessage(messages.newCreditCardLabel)}
          />
        </GroupOption>
      </ListGroup>
    </div>
  )
}

export default PaymentList
