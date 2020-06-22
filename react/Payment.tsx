import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Router } from 'vtex.checkout-container'
import { PaymentSystem } from 'vtex.checkout-graphql'

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
    value,
    referenceValue,
  } = useOrderPayment()
  const history = Router.useHistory()

  const onCardFormCompleted = (cardDigits: string) => {
    setCardLastDigits(cardDigits)
    setStage(PaymentStage.INSTALLMENTS)
  }

  const onInstallmentSelected = async (installment: number) => {
    await setPaymentField({
      installments: installment,
    })
    history.push(REVIEW_ROUTE)
  }

  const handleNewCreditCard = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const handleBankInvoiceSelect = async (payment: PaymentSystem) => {
    await setPaymentField({
      paymentSystem: payment.id,
      installments: 1,
      installmentsInterestRate: 0,
      value,
      referenceValue,
    })
    history.push(REVIEW_ROUTE)
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
        <PaymentList
          onNewCreditCard={handleNewCreditCard}
          onBankInvoiceSelect={handleBankInvoiceSelect}
        />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          onInstallmentSelected={onInstallmentSelected}
          onBackToCardForm={handleNewCreditCard}
          cardLastDigits={cardLastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
