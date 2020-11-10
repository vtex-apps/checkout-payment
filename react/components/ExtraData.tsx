import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { defineMessages, useIntl } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ButtonPlain, Button } from 'vtex.styleguide'
import { useFormattedPrice } from 'vtex.formatted-price'
import { DocumentField } from 'vtex.document-field'

import CardSummary from '../CardSummary'

const messages = defineMessages({
  installmentValue: {
    id: 'store/checkout-payment.installmentValue',
  },
  changeInstallments: {
    id: 'store/checkout-payment.changeInstallments',
  },
  selectedPaymentLabel: { id: 'store/checkout-payment.selectedPaymentLabel' },
  creditCardExtraDataMessage: {
    id: 'store/checkout-payment.creditCardExtraDataMessage',
  },
  reviewPurchaseLabel: {
    id: 'store/checkout-payment.reviewPurchaseLabel',
  },
  documentLabel: {
    id: 'store/checkout-payment.documentLabel',
  },
  requiredField: {
    id: 'store/checkout-payment.requiredField',
  },
  invalidDigits: {
    id: 'store/checkout-payment.invalidDigits',
  },
})

interface Field {
  value: string
  error: boolean
  errorMessage: string
  showError: boolean
}

const initialDocument: Field = {
  value: '',
  error: false,
  errorMessage: '',
  showError: false,
}

interface Props {
  onDeselectPayment: () => void
  cardType: CardType
  onSubmit: () => void
  onChangeInstallments: () => void
}

const ExtraData: React.VFC<Props> = ({
  onDeselectPayment,
  cardType,
  onSubmit,
  onChangeInstallments,
}) => {
  const { cardLastDigits, payment } = useOrderPayment()
  const intl = useIntl()
  const [userDocument, setDocument] = useState<Field>(initialDocument)

  const { orderForm } = useOrderForm()

  const installmentOptions = orderForm.paymentData.installmentOptions.find(
    installmentOption =>
      installmentOption.paymentSystem === payment.paymentSystem
  )!
  const selectedInstallmentOption = installmentOptions.installments.find(
    ({ count }) => count === payment.installments
  )!

  const formattedInstallmentValue = useFormattedPrice(
    (selectedInstallmentOption.value ?? 0) / 100
  )

  const validateDocument = () => {
    if (!userDocument.value) {
      setDocument(prevDocument => ({
        ...prevDocument,
        showError: true,
        error: true,
        errorMessage: intl.formatMessage(messages.requiredField),
      }))
      return false
    }

    if (userDocument.error) {
      setDocument(prevDocument => ({
        ...prevDocument,
        showError: true,
        errorMessage: intl.formatMessage(messages.invalidDigits),
      }))
      return false
    }

    return true
  }

  const handleChangeDocument = (data: any) => {
    setDocument({
      value: data.document,
      error: !data.isValid,
      errorMessage: '',
      showError: false,
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault()

    const documentIsValid = validateDocument()

    if (cardType === 'new' && !documentIsValid) {
      return
    }

    onSubmit()
  }

  return (
    <div>
      <span className="dib t-heading-6 mb5">
        {intl.formatMessage(messages.selectedPaymentLabel)}
      </span>

      <CardSummary
        lastDigits={cardLastDigits}
        paymentSystem={payment.paymentSystem ?? undefined}
        onEdit={onDeselectPayment}
        description={
          <div className="pv3 flex items-center">
            <span className="c-muted-1">
              {intl.formatMessage(messages.installmentValue, {
                installments: selectedInstallmentOption.count,
                value: formattedInstallmentValue,
              })}
            </span>

            <div className="ml3">
              <ButtonPlain onClick={onChangeInstallments}>
                <span className="ttl">
                  {intl.formatMessage(messages.changeInstallments)}
                </span>
              </ButtonPlain>
            </div>
          </div>
        }
      />

      <span className="dib mt5 t-body lh-copy">
        {intl.formatMessage(messages.creditCardExtraDataMessage)}
      </span>

      <form onSubmit={handleSubmit}>
        {cardType === 'new' && (
          <div className="mt6 flex items-center">
            <div className="w-100 mw-100 mw5-ns">
              <DocumentField
                label={intl.formatMessage(messages.documentLabel)}
                documentType="cpf"
                onChange={handleChangeDocument}
                onBlur={validateDocument}
                document={userDocument.value}
                error={userDocument.error && userDocument.showError}
                errorMessage={
                  userDocument.showError ? userDocument.errorMessage : ''
                }
              />
            </div>
          </div>
        )}

        <div className="mt7">
          <Button size="large" block type="submit">
            <span className="f5">
              {intl.formatMessage(messages.reviewPurchaseLabel)}
            </span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ExtraData
