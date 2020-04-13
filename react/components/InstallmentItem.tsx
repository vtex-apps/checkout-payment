import React from 'react'
import { useFormattedPrice } from 'vtex.formatted-price'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  installmentValue: {
    id: 'checkout-payment.installmentValue',
  },
  singleInstallmentValue: {
    id: 'checkout-payment.singleInstallmentValue',
  },
  interestFree: {
    id: 'checkout-payment.interestFree',
  },
})

const InstallmentIcon: React.FC = () => (
  <svg
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

interface Props {
  installment: any
}

const InstallmentItem: React.FC<Props> = ({ installment }) => {
  const intl = useIntl()

  const formattedPrice = useFormattedPrice(installment.value / 100)

  const primaryInfo =
    installment.count === 1
      ? intl.formatMessage(messages.singleInstallmentValue, {
          value: formattedPrice,
        })
      : intl.formatMessage(messages.installmentValue, {
          installments: installment.count,
          value: formattedPrice,
        })

  const secondaryInfo = installment.hasInterestRate
    ? intl.formatMessage(messages.interestFree)
    : ''

  return (
    <div className="flex mv2 pv5 ml5 pr5 bb b--muted-4">
      <div className="flex-auto">{primaryInfo}</div>
      <div className="flex-none c-success">{secondaryInfo}</div>
      <div className="flex-none pl5">
        <InstallmentIcon />
      </div>
    </div>
  )
}

export default InstallmentItem
