import React from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
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

const PaymentSummary: React.FC = () => {
  const {
    payment: { referenceValue, installments },
    cardFormData,
  } = useOrderPayment()

  const intl = useIntl()

  const value =
    referenceValue && installments && referenceValue / 100 / installments

  const formattedValue = useFormattedPrice(value)

  if (!installments || !value || !cardFormData) {
    return null
  }

  const messageValue =
    installments === 1
      ? intl.formatMessage(messages.singleInstallmentValue, {
          value: formattedValue,
        })
      : intl.formatMessage(messages.installmentValue, {
          installments,
          value: formattedValue,
        })

  return (
    <div className="c-muted-1 flex flex-column lh-copy">
      <span className="dib">
        Cartão de crédito terminando em {cardFormData.lastDigits}
      </span>
      <span className="dib">
        {messageValue} - {intl.formatMessage(messages.interestFree)}
      </span>
    </div>
  )
}

export default PaymentSummary
