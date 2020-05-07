import React from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { useFormattedPrice } from 'vtex.formatted-price'
import { useIntl, defineMessages } from 'react-intl'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'

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
  paymentSummaryCardMessage: {
    id: 'checkout-payment.paymentSummaryCardMessage',
  },
})

const PaymentSummary: React.FC = () => {
  const {
    installmentOptions,
    payment: { installments: installmentCount, paymentSystem },
    cardFormData,
  } = useOrderPayment()

  const intl = useIntl()

  const selectedInstallmentOption = installmentOptions.find(
    (installmentOption: InstallmentOption) =>
      installmentOption.paymentSystem === paymentSystem
  )

  const selectedInstallment = selectedInstallmentOption?.installments.find(
    (installment: Installment) => installment.count === installmentCount
  )

  const value = selectedInstallment?.value ?? 0

  const formattedValue = useFormattedPrice(value / 100)

  if (!selectedInstallment || !cardFormData) {
    return null
  }

  const messageValue =
    selectedInstallment.count === 1
      ? intl.formatMessage(messages.singleInstallmentValue, {
          value: formattedValue,
        })
      : intl.formatMessage(messages.installmentValue, {
          installments: selectedInstallment.count,
          value: formattedValue,
        })

  return (
    <div className="c-muted-1 flex flex-column lh-copy">
      <span className="dib">
        {intl.formatMessage(messages.paymentSummaryCardMessage, {
          value: cardFormData.lastDigits,
        })}
      </span>
      <span className="dib">
        {messageValue} - {intl.formatMessage(messages.interestFree)}
      </span>
    </div>
  )
}

export default PaymentSummary
