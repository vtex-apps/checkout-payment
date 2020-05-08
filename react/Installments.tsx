import React from 'react'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { useIntl, defineMessages } from 'react-intl'
import { useFormattedPrice } from 'vtex.formatted-price'
import { ListGroup, GroupOption } from 'vtex.checkout-components'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

import CardSummary from './CardSummary'
import Header from './components/Header'
import { PaymentType } from './enums/PaymentEnums'

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
  paymentOptionLabel: {
    id: 'checkout-payment.paymentOptionLabel',
  },
})

const InstallmentItem: React.FC<{
  installment: Installment
}> = ({ installment }) => {
  const intl = useIntl()

  const formattedPrice = useFormattedPrice(installment!.value! / 100)

  const installmentValue =
    installment.count === 1
      ? intl.formatMessage(messages.singleInstallmentValue, {
          value: formattedPrice,
        })
      : intl.formatMessage(messages.installmentValue, {
          installments: installment.count,
          value: formattedPrice,
        })

  const interestRate =
    installment.hasInterestRate || installment.count === 1
      ? ''
      : intl.formatMessage(messages.interestFree)

  return (
    <>
      <div className="flex-auto">{installmentValue}</div>
      <div className="flex-none c-success">{interestRate}</div>
    </>
  )
}

interface Props {
  onInstallmentSelected: (installment: number) => void
  backToCreditCard: () => void
}

const Installments: React.FC<Props> = ({
  backToCreditCard,
  onInstallmentSelected,
}) => {
  const intl = useIntl()

  const { installmentOptions, payment, cardFormData } = useOrderPayment()

  if (!payment.paymentSystem) {
    return null
  }

  const { paymentSystem: selectedPaymentSystem } = payment

  const installmentOption = installmentOptions.find(
    ({ paymentSystem }: InstallmentOption) =>
      paymentSystem === selectedPaymentSystem
  )

  const { installments } = installmentOption!

  return (
    <div>
      <div className="mb3">
        <CardSummary
          lastDigits={cardFormData!.lastDigits}
          onClick={backToCreditCard}
          type={PaymentType.CREDIT_CARD}
        />
      </div>

      <Header>{intl.formatMessage(messages.paymentOptionLabel)}</Header>

      <ListGroup>
        {installments.map((installment: Installment) => {
          return (
            <GroupOption
              key={`${installment.count}`}
              onClick={() => onInstallmentSelected(installment.count)}
            >
              <InstallmentItem installment={installment} />
            </GroupOption>
          )
        })}
      </ListGroup>
    </div>
  )
}

export default Installments
