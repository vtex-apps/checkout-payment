import React, { useMemo } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { useIntl, defineMessages } from 'react-intl'
import { useFormattedPrice } from 'vtex.formatted-price'
import { ListGroup, GroupOption } from 'vtex.checkout-components'

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

  const interestRate = installment.hasInterestRate
    ? intl.formatMessage(messages.interestFree)
    : ''

  return (
    <>
      <div className="flex-auto">{installmentValue}</div>
      <div className="flex-none c-success">{interestRate}</div>
    </>
  )
}

interface Props {
  lastDigits: string
  selectedPaymentSystem: string
  onInstallmentSelected: (installment: number) => void
  backToCreditCard: () => void
}

const Installments: React.FC<Props> = ({
  lastDigits,
  selectedPaymentSystem,
  backToCreditCard,
  onInstallmentSelected,
}) => {
  const intl = useIntl()

  const {
    orderForm: {
      paymentData: { installmentOptions },
    },
  } = useOrderForm()

  const installmentOption = useMemo(
    () =>
      installmentOptions.find(
        ({ paymentSystem }: InstallmentOption) =>
          paymentSystem === selectedPaymentSystem
      ),
    [installmentOptions, selectedPaymentSystem]
  )

  if (!installmentOption) {
    return null
  }

  const { installments } = installmentOption

  return (
    <div>
      <div className="mb3">
        <CardSummary
          lastDigits={lastDigits}
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
