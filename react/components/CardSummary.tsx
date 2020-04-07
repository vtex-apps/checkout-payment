import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'

import flags from '../flags'

const messages = defineMessages({
  creditCardLabel: {
    id: 'checkout-payment.credit-card.label',
  },
})

const PaymentSystemIcon: React.FC<{ paymentSystem?: string }> = ({
  paymentSystem,
}) => (
  <img
    src={paymentSystem ? flags[paymentSystem] : flags[0]}
    width="40"
    height="40"
    alt=""
  />
)

interface Props {
  paymentSystem: string
  lastDigits: string
}

const CardSummary: React.FC<Props> = ({ paymentSystem, lastDigits }) => {
  const intl = useIntl()
  return (
    <div className="flex items-center">
      <PaymentSystemIcon paymentSystem={paymentSystem} />
      <span className="c-base ml5">
        {intl.formatMessage(messages.creditCardLabel)} &middot; &middot;
        &middot; &middot;{lastDigits}
      </span>
      <div className="dib ml4">
        <ButtonPlain>
          <IconEdit solid />
        </ButtonPlain>
      </div>
    </div>
  )
}

export default CardSummary
