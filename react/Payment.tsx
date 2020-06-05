import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Router } from 'vtex.checkout-container'

import CreditCard from './CreditCard'
import Installments from './Installments'
import PaymentList from './PaymentList'
import { PaymentStage } from './enums/PaymentEnums'

const REVIEW_ROUTE = '/'

const Payment: React.FC = () => {
  const [stage, setStage] = useState<PaymentStage>(PaymentStage.PAYMENT_LIST)
  const {
    setPaymentField,
    cardLastDigits,
    setCardLastDigits,
  } = useOrderPayment()
  const history = Router.useHistory()

  const onCardFormCompleted = (cardDigits: string) => {
    setCardLastDigits(cardDigits)
    setStage(PaymentStage.INSTALLMENTS)
  }

  const onInstallmentSelected = (installment: number) => {
    setPaymentField({
      installments: installment,
    })
    history.push(REVIEW_ROUTE)
  }

  const goToCardForm = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const goToPaymentList = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  return (
    <>
      <div className={stage === PaymentStage.CARD_FORM ? '' : 'dn'}>
        <CreditCard
          onCardFormCompleted={onCardFormCompleted}
          onChangePaymentMethod={goToPaymentList}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList onNewCreditCard={goToCardForm} />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          onInstallmentSelected={onInstallmentSelected}
          onBackToCardForm={goToCardForm}
          cardLastDigits={cardLastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
