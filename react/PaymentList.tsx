import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { AvailableAccount } from 'vtex.checkout-graphql'

import PageSubTitle from './components/PageSubTitle'
import PaymentSystemIcon from './components/PaymentSystemIcon'
import SelectableListItem from './components/SelectableListItem'

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

const CardInfo: React.FC<{
  paymentSystem?: string
  lastDigits?: string
}> = ({ paymentSystem, lastDigits }) => {
  const intl = useIntl()

  return (
    <div className="flex items-center c-muted-1">
      <PaymentSystemIcon paymentSystem={paymentSystem} />
      {lastDigits ? (
        <span className="ml5">
          {intl.formatMessage(messages.creditCardLabel)} &middot; &middot;
          &middot; &middot;{lastDigits}
        </span>
      ) : (
        <span className="ml5">
          {intl.formatMessage(messages.newCreditCardLabel)}
        </span>
      )}
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
      <div className="bb b--muted-4">
        <PageSubTitle>
          {intl.formatMessage(messages.choosePaymentMethod)}
        </PageSubTitle>
      </div>

      {availableAccounts.map((payment: AvailableAccount) => {
        const lastDigits = payment.cardNumber.replace(/[^\d]/g, '')

        return (
          <SelectableListItem
            key={payment.accountId}
            primaryInfo={
              <CardInfo
                paymentSystem={payment.paymentSystem}
                lastDigits={lastDigits}
              />
            }
            secondaryInfo="Up to 12x interest-free"
            onClick={() => {}}
          />
        )
      })}
      <SelectableListItem
        primaryInfo={<CardInfo />}
        secondaryInfo="Up to 12x interest-free"
        onClick={newCreditCard}
      />
    </div>
  )
}

export default PaymentList
