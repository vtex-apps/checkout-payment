import React from 'react'
import { useIntl, defineMessages } from 'react-intl'

import CardSummary from './CardSummary'
import PageSubTitle from './components/PageSubTitle'
import { PaymentAction, PaymentType } from './enums/PaymentEnums'

const messages = defineMessages({
  choosePaymentMethod: {
    id: 'checkout-payment.choosePaymentMethodLabel',
  },
})

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
      <CardSummary
        type={PaymentType.CREDIT_CARD}
        action={PaymentAction.CREATE}
        handleClick={newCreditCard}
      />
    </div>
  )
}

export default PaymentList
