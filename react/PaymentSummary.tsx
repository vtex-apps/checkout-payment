import React from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { useFormattedPrice } from 'vtex.formatted-price'
import { useIntl, defineMessages } from 'react-intl'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'

const messages = defineMessages({
  installmentValue: {
    id: 'store/checkout-payment.installmentValue',
  },
  summaryInstallments: {
    id: 'store/checkout-payment.summaryInstallments',
  },
  paymentSummaryCardMessage: {
    id: 'store/checkout-payment.paymentSummaryCardMessage',
  },
})

const PaymentSummary: React.FC = () => {
  const {
    installmentOptions,
    payment: { installments: installmentCount, paymentSystem },
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

  if (!selectedInstallment) {
    return null
  }

  const installmentsMessage = intl.formatMessage(messages.installmentValue, {
    installments: selectedInstallment.count,
    value: formattedValue,
  })

  return (
    <div className="c-muted-1 flex flex-column lh-copy">
      <span>
        {intl.formatMessage(messages.paymentSummaryCardMessage, {
          value: '1234',
        })}
      </span>
      <span>
        {intl.formatMessage(messages.summaryInstallments, {
          installmentsMessage,
          hasInterestRate: selectedInstallment.hasInterestRate,
        })}
      </span>
    </div>
  )
}

export default PaymentSummary
