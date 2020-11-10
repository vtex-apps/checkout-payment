import React from 'react'
import { Installment, InstallmentOption } from 'vtex.checkout-graphql'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { useFormattedPrice } from 'vtex.formatted-price'
import { ListGroup, GroupOption, Modal } from 'vtex.checkout-components'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

const messages = defineMessages({
  installmentValue: {
    id: 'store/checkout-payment.installmentValue',
  },
  interestFree: {
    id: 'store/checkout-payment.interestFree',
  },
  installmentsTitle: {
    id: 'store/checkout-payment.installmentsTitle',
  },
  installmentOptionLabel: {
    id: 'store/checkout-payment.installmentOptionLabel',
  },
})

const InstallmentItem: React.FC<{
  installment: Installment
}> = ({ installment }) => {
  const intl = useIntl()

  const formattedPrice = useFormattedPrice(installment!.value! / 100)

  const installmentValue = intl.formatMessage(messages.installmentValue, {
    installments: installment.count,
    value: formattedPrice,
  })

  const interestRateMessage =
    installment.hasInterestRate || installment.count === 1
      ? ''
      : intl.formatMessage(messages.interestFree)

  return (
    <>
      <div className="flex-auto">{installmentValue}</div>
      <div className="flex-none c-success">{interestRateMessage}</div>
    </>
  )
}

interface Props {
  isOpen: boolean
  onInstallmentSelected: (installment: number) => void
  onClose?: () => void
}

const InstallmentsModal: React.FC<Props> = ({
  isOpen,
  onInstallmentSelected,
  onClose = () => {},
}) => {
  const { installmentOptions, payment } = useOrderPayment()

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<FormattedMessage {...messages.installmentsTitle} />}
    >
      <span className="dib mt1 mb3 t-body fw6">
        <FormattedMessage {...messages.installmentOptionLabel} />
      </span>

      <div className="pl5">
        <ListGroup>
          {installments.map((installment: Installment) => {
            return (
              <GroupOption
                key={installment.count}
                onClick={() => onInstallmentSelected(installment.count)}
                caretAlign="center"
                lean
              >
                <InstallmentItem installment={installment} />
              </GroupOption>
            )
          })}
        </ListGroup>
      </div>
    </Modal>
  )
}

export default InstallmentsModal
