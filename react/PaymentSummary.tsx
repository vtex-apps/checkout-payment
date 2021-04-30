import React from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { useFormattedPrice } from 'vtex.formatted-price'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { Alert } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import { useCssHandles } from 'vtex.css-handles'

const { useOrderForm } = OrderForm

const CSS_HANDLES = ['customPaymentSystemName', 'summaryInstallmentsMessage']

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
    paymentSystems,
    payment: { installments: installmentCount, paymentSystem: paymentSystemId },
    cardLastDigits,
    isFreePurchase,
  } = useOrderPayment()

  const { orderForm } = useOrderForm()

  const hasValidProfileData = orderForm.clientProfileData?.isValid ?? false
  const hasValidShippingData = orderForm.shipping.isValid

  const lastStepsValid = hasValidProfileData && hasValidShippingData

  const intl = useIntl()

  const { handles } = useCssHandles(CSS_HANDLES)

  const selectedPaymentSystem = paymentSystems.find(
    paymentSystem => paymentSystem.id === paymentSystemId
  )

  const selectedInstallmentOption = installmentOptions.find(
    (installmentOption: InstallmentOption) =>
      installmentOption.paymentSystem === paymentSystemId
  )

  const selectedInstallment = selectedInstallmentOption?.installments.find(
    (installment: Installment) => installment.count === installmentCount
  )

  const installmentValue = selectedInstallment?.value ?? 0

  const formattedInstallmentValue = useFormattedPrice(installmentValue / 100)

  let summary = null

  switch (selectedPaymentSystem?.groupName) {
    case 'creditCardPaymentGroup': {
      if (!selectedInstallment) {
        return null
      }

      const installmentsMessage = intl.formatMessage(
        messages.installmentValue,
        {
          installments: selectedInstallment.count,
          value: formattedInstallmentValue,
        }
      )

      summary = (
        <>
          <span>
            {intl.formatMessage(messages.paymentSummaryCardMessage, {
              value: cardLastDigits,
            })}
          </span>
          <span>
            {intl.formatMessage(messages.summaryInstallments, {
              installmentsMessage,
              hasInterestRate: selectedInstallment.hasInterestRate,
            })}
          </span>
        </>
      )

      break
    }
    case 'bankInvoicePaymentGroup': {
      summary = (
        <>
          <span>{selectedPaymentSystem.name}</span>
          <span>
            <FormattedMessage id="store/checkout-payment.boletoGenerationMessage" />
          </span>

          <div className="mt6">
            <Alert type="warning">
              <FormattedMessage id="store/checkout-payment.boletoNotice" />
            </Alert>
          </div>
        </>
      )
      break
    }
    default:
      if (lastStepsValid && isFreePurchase) {
        return (
          <Alert type="success">
            <FormattedMessage id="store/checkout-payment.freePurchase" />
          </Alert>
        )
      }

      if (selectedPaymentSystem?.groupName.startsWith('custom')) {
        const installmentsMessage = intl.formatMessage(
          messages.installmentValue,
          {
            installments: selectedInstallment?.count ?? 1,
            value: formattedInstallmentValue,
          }
        )

        summary = (
          <>
            <span className={handles.customPaymentSystemName}>
              {selectedPaymentSystem.name}
            </span>
            <span className={handles.summaryInstallmentsMessage}>
              {intl.formatMessage(messages.summaryInstallments, {
                installmentsMessage,
                hasInterestRate: !!selectedInstallment?.hasInterestRate,
              })}
            </span>
          </>
        )
      } else {
        return null
      }
  }

  return <div className="c-muted-1 flex flex-column lh-copy">{summary}</div>
}

export default PaymentSummary
