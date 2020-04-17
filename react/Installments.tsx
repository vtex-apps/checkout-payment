import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { useIntl, defineMessages } from 'react-intl'
import { useFormattedPrice } from 'vtex.formatted-price'

import CardSummary from './CardSummary'
import PageSubTitle from './components/PageSubTitle'
import { PaymentType } from './enums/PaymentEnums'
import SelectableListItem from './components/SelectableListItem'

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

const InstallmentItem: React.FC<{ installment: Installment }> = ({
  installment,
}) => {
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
    <SelectableListItem
      onClick={() => {}}
      primaryInfo={primaryInfo}
      secondaryInfo={secondaryInfo}
    />
  )
}

interface Props {
  lastDigits: string
  backToCreditCard: () => void
}

const Installments: React.FC<Props> = ({ lastDigits, backToCreditCard }) => {
  const intl = useIntl()

  const {
    orderForm: {
      paymentData: { installmentOptions, payments },
    },
  } = useOrderForm()

  const [payment] = payments

  if (!payment || !payment.paymentSystem) {
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
      <div className="mb4">
        <CardSummary
          lastDigits={lastDigits}
          onClick={backToCreditCard}
          type={PaymentType.CREDIT_CARD}
        />
      </div>
      <div className="bb b--muted-4">
        <PageSubTitle>
          {intl.formatMessage(messages.paymentOptionLabel)}
        </PageSubTitle>
      </div>
      <div>
        {installments.map((installment: Installment) => {
          return (
            <InstallmentItem
              key={`${installment.count}`}
              installment={installment}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Installments
