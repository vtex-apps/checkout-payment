/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'

import { PaymentAction, PaymentType } from './enums/PaymentEnums'
import flags from './flags'

const messages = defineMessages({
  creditCardLabel: {
    id: 'checkout-payment.creditCardLabel',
  },
  newCreditCardLabel: {
    id: 'checkout-payment.newCreditCardLabel',
  },
})

const ArrowIcon: React.FC = () => (
  <svg
    className="db"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M9.70757 5.29341L4.70757 0.293407C4.51897 0.111249 4.26636 0.0104547 4.00417 0.0127331C3.74197 0.0150115 3.49116 0.12018 3.30575 0.305589C3.12034 0.490997 3.01517 0.741809 3.0129 1.00401C3.01062 1.2662 3.11141 1.5188 3.29357 1.70741L7.58657 6.00041L3.29357 10.2934C3.19806 10.3857 3.12188 10.496 3.06947 10.618C3.01706 10.74 2.98947 10.8712 2.98832 11.004C2.98717 11.1368 3.01247 11.2685 3.06275 11.3914C3.11303 11.5143 3.18728 11.6259 3.28117 11.7198C3.37507 11.8137 3.48672 11.8879 3.60962 11.9382C3.73251 11.9885 3.86419 12.0138 3.99697 12.0127C4.12975 12.0115 4.26097 11.9839 4.38297 11.9315C4.50498 11.8791 4.61532 11.8029 4.70757 11.7074L9.70757 6.70741C9.89504 6.51988 10.0004 6.26557 10.0004 6.00041C10.0004 5.73524 9.89504 5.48094 9.70757 5.29341Z"
        fill="#134CD8"
      />
    </g>
    <defs>
      <clipPath>
        <path d="M0 0H12V12H0V0Z" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const PaymentSystemIcon: React.FC<{ paymentSystem?: string }> = ({
  paymentSystem,
}) => (
  <img
    src={paymentSystem ? flags[paymentSystem] : flags.NewPaymentMethod}
    alt=""
  />
)

interface Props {
  paymentSystem?: string
  lastDigits?: string
  handleClick: () => void
  type: PaymentType
  action: PaymentAction
}

const CardSummary: React.FC<Props> = ({
  paymentSystem,
  lastDigits,
  handleClick,
  type,
  action,
}) => {
  const intl = useIntl()

  if (type === PaymentType.CREDIT_CARD) {
    if (action === PaymentAction.UPDATE) {
      return (
        <div className="pv5 pr5 c-muted-1 pl5">
          <div className="flex items-center">
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
            <div className="dib ml4">
              <ButtonPlain onClick={handleClick}>
                <IconEdit solid />
              </ButtonPlain>
            </div>
          </div>
        </div>
      )
    }
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className="pv5 pr5 c-muted-1 ml5 bb b--muted-4"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <div className="flex-none">
            <PaymentSystemIcon paymentSystem={paymentSystem} />
          </div>
          <div className="flex-auto">
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
          <div className="flex-none pl5">
            <ArrowIcon />
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default CardSummary
