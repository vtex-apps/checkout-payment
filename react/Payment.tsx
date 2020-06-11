import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Router } from 'vtex.checkout-container'
import { AvailableAccount } from 'vtex.checkout-graphql'

import CreditCard from './CreditCard'
import Installments from './Installments'
import PaymentList from './PaymentList'
import { PaymentStage } from './enums/PaymentEnums'

const REVIEW_ROUTE = '/'

const Payment: React.FC = () => {
  const [stage, setStage] = useState<PaymentStage>(PaymentStage.PAYMENT_LIST)
  const [cardType, setCardType] = useState<CardType>('new')

  const {
    setPaymentField,
    cardLastDigits,
    setCardLastDigits,
  } = useOrderPayment()
  const history = Router.useHistory()

  const goToInstallments = () => {
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

  const useNewCreditCard = () => {
    setCardType('new')
    goToCardForm()
  }

  const goToPaymentList = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  const useSavedCreditCard = (payment: AvailableAccount) => {
    setPaymentField({
      paymentSystem: payment.paymentSystem,
      accountId: payment.accountId,
      bin: payment.bin,
    })
    setCardLastDigits(payment.cardNumber.slice(-4))
    setCardType('saved')
    goToCardForm()
  }

  return (
    <>
      <div className={stage === PaymentStage.CARD_FORM ? '' : 'dn'}>
        <CreditCard
          onCardFormCompleted={goToInstallments}
          onChangePaymentMethod={goToPaymentList}
          onCardTypeChange={() => setStage(PaymentStage.CARD_FORM)}
          cardType={cardType}
          key={cardType}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList
          onNewCreditCard={useNewCreditCard}
          onSavedCreditCard={useSavedCreditCard}
        />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          onInstallmentSelected={onInstallmentSelected}
          onBackToCardForm={() => setStage(PaymentStage.CARD_FORM)}
          cardLastDigits={cardLastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
