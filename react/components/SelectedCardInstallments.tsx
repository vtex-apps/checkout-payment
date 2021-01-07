import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useFormattedPrice } from 'vtex.formatted-price'
import { ButtonPlain } from 'vtex.styleguide'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

const messages = defineMessages({
  installmentValue: {
    id: 'store/checkout-payment.installmentValue',
  },
  changeInstallments: {
    id: 'store/checkout-payment.changeInstallments',
  },
})

interface Props {
  onChangeInstallments: () => void
}

const SelectedCardInstallments: React.FC<Props> = ({
  onChangeInstallments,
}) => {
  const intl = useIntl()
  const { payment } = useOrderPayment()
  const { orderForm } = useOrderForm()

  const installmentOptions = orderForm.paymentData.installmentOptions.find(
    installmentOption =>
      installmentOption.paymentSystem === payment.paymentSystem
  )
  const selectedInstallmentOption = installmentOptions?.installments.find(
    ({ count }) => count === payment.installments
  ) ?? {
    value: 0,
    count: 1,
    hasInterestRate: false,
    interestRate: null,
    total: 0,
    __typename: 'Installment',
  }

  const formattedInstallmentValue = useFormattedPrice(
    (selectedInstallmentOption.value ?? 0) / 100
  )

  return (
    <div className="pv3 flex items-center">
      <span className="c-muted-1">
        {intl.formatMessage(messages.installmentValue, {
          installments: selectedInstallmentOption.count,
          value: formattedInstallmentValue,
        })}
      </span>

      <div className="ml3 flex items-center">
        <ButtonPlain onClick={onChangeInstallments}>
          <span className="ttl">
            {intl.formatMessage(messages.changeInstallments)}
          </span>
        </ButtonPlain>
      </div>
    </div>
  )
}

export default SelectedCardInstallments
