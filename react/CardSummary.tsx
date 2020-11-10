import React, { ReactNode } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { PaymentFlag } from 'vtex.payment-flags'
import { SelectedCard } from 'vtex.checkout-components'

import CardLabel from './components/CardLabel'
import styles from './styles.css'

const messages = defineMessages({
  creditCardLabel: {
    id: 'store/checkout-payment.creditCardLabel',
  },
})

interface Props {
  paymentSystem?: string
  lastDigits?: string
  onEdit: () => void
  description?: ReactNode
}

const CardSummary: React.FC<Props> = ({
  paymentSystem,
  lastDigits,
  onEdit,
  description,
}) => {
  const intl = useIntl()

  return (
    <SelectedCard
      className={`${styles.fullWidth} nl5 nl0-ns`}
      onDeselect={onEdit}
      title={
        <span className="inline-flex items-center f5">
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
              {intl.formatMessage(messages.creditCardLabel)}
            </span>
          )}
        </span>
      }
      description={description}
    />
  )
}

export default CardSummary
