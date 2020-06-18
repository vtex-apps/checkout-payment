import React, { useState } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Router } from 'vtex.checkout-container'
import { AvailableAccount, PaymentSystem } from 'vtex.checkout-graphql'

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
    value,
    referenceValue,
  } = useOrderPayment()
  const history = Router.useHistory()

  const goToCardForm = () => {
    setStage(PaymentStage.CARD_FORM)
  }

  const goToInstallments = () => {
    setStage(PaymentStage.INSTALLMENTS)
  }

  const goToPaymentList = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  const handleNewCreditCard = () => {
    setCardType('new')
    goToCardForm()
  }

  const handleSavedCreditCard = async (payment: AvailableAccount) => {
    await setPaymentField({
      paymentSystem: payment.paymentSystem,
      accountId: payment.accountId,
      bin: payment.bin,
    })
    setCardLastDigits(payment.cardNumber.slice(-4))
    setCardType('saved')
    goToCardForm()
  }

  const handleInstallmentSelected = async (installment: number) => {
    await setPaymentField({
      installments: installment,
    })
    history.push(REVIEW_ROUTE)
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

  return (
    <>
      <div className={stage === PaymentStage.CARD_FORM ? '' : 'dn'}>
        <CreditCard
          onCardFormCompleted={goToInstallments}
          onChangePaymentMethod={goToPaymentList}
          cardType={cardType}
          key={cardType}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList
          onNewCreditCard={handleNewCreditCard}
          onSavedCreditCard={handleSavedCreditCard}
          onBankInvoiceSelect={handleBankInvoiceSelect}
        />
      ) : stage === PaymentStage.INSTALLMENTS ? (
        <Installments
          onInstallmentSelected={handleInstallmentSelected}
          onBackToCardForm={goToCardForm}
          cardLastDigits={cardLastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
