import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { PaymentFlag } from 'vtex.payment-flags'

import { PaymentType } from './enums/PaymentEnums'
import CardLabel from './components/CardLabel'

const messages = defineMessages({
  creditCardLabel: {
    id: 'store/checkout-payment.creditCardLabel',
  },
  newCreditCardLabel: {
    id: 'store/checkout-payment.newCreditCardLabel',
  },
})

interface Props {
  paymentSystem?: string
  lastDigits?: string
  onClick: () => void
  type: PaymentType
}

const CardSummary: React.FC<Props> = ({
  paymentSystem,
  lastDigits,
  onClick,
}) => {
  const intl = useIntl()

  return (
    <div className="pv5 ph0 ph5-md c-muted-1">
      <div className="flex items-center">
        <div className="h1">
          <PaymentFlag paymentSystemId={paymentSystem ?? ''} />
        </div>
        {lastDigits ? (
          <CardLabel
            className="ml3"
            label={intl.formatMessage(messages.creditCardLabel)}
            lastDigits={lastDigits}
          />
        ) : (
          <span className="ml3">
            {intl.formatMessage(messages.newCreditCardLabel)}
          </span>
        )}
        <div className="dib ml4">
          <ButtonPlain onClick={onClick}>
            <IconEdit solid />
          </ButtonPlain>
        </div>
      </div>
    </div>
  )
}

export default CardSummary
