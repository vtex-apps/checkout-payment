import React, { useState } from 'react'

import CreditCard from './CreditCard'
import Installments from './Installments'
import PaymentList from './PaymentList'
import { PaymentStage } from './enums/PaymentEnums'

const Payment: React.FC = () => {
  const [stage, setStage] = useState<PaymentStage>(PaymentStage.PAYMENT_LIST)
  const [cardFormData, setCardFormData] = useState<CardFormData | null>(null)

  const onCardFormCompleted = (cardForm: CardFormData) => {
    setCardFormData(cardForm)
    setStage(PaymentStage.INSTALLMENTS)
  }

  const backToCreditCard = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const newCreditCard = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const backToPaymentList = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  return (
    <>
      <div className={stage === PaymentStage.CARD_FORM ? '' : 'dn'}>
        <CreditCard
          onCardFormCompleted={onCardFormCompleted}
          backToPaymentList={backToPaymentList}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList newCreditCard={newCreditCard} />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          backToCreditCard={backToCreditCard}
          lastDigits={cardFormData!.lastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
