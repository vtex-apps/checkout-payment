import React from 'react'
import { useIntl, defineMessages } from 'react-intl'

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
  label: string
}> = ({ paymentSystem, label }) => {
  return (
    <div className="flex items-center">
      <PaymentSystemIcon paymentSystem={paymentSystem} />
      <span className="c-base ml5">{label}</span>
    </div>
  )
}

interface Props {
  newCreditCard: () => void
}

const PaymentList: React.FC<Props> = ({ newCreditCard }) => {
  const intl = useIntl()

  return (
    <div>
      <div className="bb b--muted-4">
        <PageSubTitle>
          {intl.formatMessage(messages.choosePaymentMethod)}
        </PageSubTitle>
      </div>
      <SelectableListItem
        primaryInfo={
          <CardInfo
            label={intl.formatMessage(messages.newCreditCardLabel)}
            paymentSystem="2"
          />
        }
        secondaryInfo="Up to 12x interest-free"
        onClick={newCreditCard}
      />
    </div>
  )
}

export default PaymentList
