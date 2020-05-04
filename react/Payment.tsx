import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

import CreditCard from './CreditCard'
import Installments from './Installments'
import PaymentList from './PaymentList'
import { PaymentStage } from './enums/PaymentEnums'

const Payment: React.FC = () => {
  const [stage, setStage] = useState<PaymentStage>(PaymentStage.PAYMENT_LIST)
  const {
    cardFormData,
    setCardFormData,
    setOrderPayment,
    payment,
  } = useOrderPayment()

  const onCardFormCompleted = () => {
    setStage(PaymentStage.INSTALLMENTS)
  }

  const onInstallmentSelected = (installment: number) => {
    const newPayment = {
      ...payment,
      paymentSystem: Number(payment.paymentSystem),
      installments: installment,
    }
    setOrderPayment({
      payments: [newPayment],
    })
  }

  const backToCreditCard = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const newCreditCard = () => {
    setCardFormData(null)
    setStage(PaymentStage.CARD_FORM)
  }

  const editCard = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const backToPaymentList = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  return (
    <>
      <div className={stage === PaymentStage.CARD_FORM ? '' : 'dn'}>
        <CreditCard
          newCard={!cardFormData}
          onCardFormCompleted={onCardFormCompleted}
          backToPaymentList={backToPaymentList}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList newCreditCard={newCreditCard} editCard={editCard} />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          onInstallmentSelected={onInstallmentSelected}
          backToCreditCard={backToCreditCard}
        />
      ) : null}
    </>
  )
}

export default Payment
