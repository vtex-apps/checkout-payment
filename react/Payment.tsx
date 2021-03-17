import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Router, routes } from 'vtex.checkout-container'
import { AvailableAccount, PaymentSystem, Address } from 'vtex.checkout-graphql'
import { useCssHandles } from 'vtex.css-handles'

import CreditCard, { CreditCardRef } from './CreditCard'
import PaymentList from './PaymentList'
import { PaymentStage } from './enums/PaymentEnums'
import InstallmentsModal from './components/InstallmentsModal'
import ExtraData from './components/ExtraData'

const { useHistory } = Router

const CSS_HANDLES = ['creditCardContainer'] as const

const Payment: React.FC = () => {
  const [cardType, setCardType] = useState<CardType>('new')
  const {
    setPaymentField,
    setCardLastDigits,
    value,
    referenceValue,
    setCardFormFilled,
    isFreePurchase,
  } = useOrderPayment()
  const [stage, setStage] = useState<PaymentStage>(
    isFreePurchase ? PaymentStage.FREE_PURCHASE : PaymentStage.PAYMENT_LIST
  )
  const creditCardRef = useRef<CreditCardRef>(null)
  const history = useHistory()

  const [installmentsModalOpen, setInstallmentsModalOpen] = useState(false)

  useEffect(() => {
    if (isFreePurchase) {
      history.push(routes.REVIEW)
    }
  }, [history, isFreePurchase])

  const { handles } = useCssHandles(CSS_HANDLES)

  const handleCardFormCompleted = () => {
    setCardFormFilled(true)
    if (cardType === 'new') {
      setInstallmentsModalOpen(true)
    } else {
      history.push(routes.REVIEW)
    }
  }

  const handleDeselectPayment = () => {
    creditCardRef?.current?.resetCardFormData()

    setCardFormFilled(false)
    setStage(PaymentStage.CARD_FORM)
  }

  const handleChangePaymentMethod = () => {
    setStage(PaymentStage.PAYMENT_LIST)
  }

  const handleNewCreditCard = () => {
    setCardType('new')
    handleDeselectPayment()
  }

  const handleSavedCreditCard = async (payment: AvailableAccount) => {
    setCardLastDigits(payment.cardNumber.slice(-4))
    setCardType('saved')
    await setPaymentField({
      paymentSystem: payment.paymentSystem,
      accountId: payment.accountId,
      bin: payment.bin,
    })
    handleDeselectPayment()
    setInstallmentsModalOpen(true)
  }

  const handleInstallmentSelected = async (installment: number) => {
    setInstallmentsModalOpen(false)
    await setPaymentField({
      installments: installment,
    })
    if (cardType === 'saved') {
      history.push(routes.REVIEW)
    } else {
      setStage(PaymentStage.EXTRA_DATA)
    }
  }

  const handleBankInvoiceSelect = async (payment: PaymentSystem) => {
    await setPaymentField({
      paymentSystem: payment.id,
      installments: 1,
      installmentsInterestRate: 0,
      value,
      referenceValue,
    })
    history.push(routes.REVIEW)
  }

  const handleCustomPaymentSelect = async (payment: PaymentSystem) => {
    await setPaymentField({
      paymentSystem: payment.id,
      installments: 1,
      installmentsInterestRate: 0,
      value,
      referenceValue,
    })
    history.push(routes.REVIEW)
  }

  const handleExtraDataSubmit = () => {
    history.push(routes.REVIEW)
  }

  const handleBillingAddressChange = useCallback(
    (address: string | Address) => {
      creditCardRef.current?.updateAddress(address)
    },
    []
  )

  const handleDocumentChange = (doc: string) => {
    creditCardRef.current?.updateDocument(doc)
  }

  return (
    <>
      <div
        className={`${handles.creditCardContainer} ${
          stage === PaymentStage.CARD_FORM ? '' : 'dn'
        }`}
      >
        <CreditCard
          ref={creditCardRef}
          onCardFormCompleted={handleCardFormCompleted}
          onChangePaymentMethod={handleChangePaymentMethod}
          onChangeInstallments={() => setInstallmentsModalOpen(true)}
          cardType={cardType}
          key={cardType}
        />
      </div>
      {stage === PaymentStage.PAYMENT_LIST ? (
        <PaymentList
          onNewCreditCard={handleNewCreditCard}
          onSavedCreditCard={handleSavedCreditCard}
          onBankInvoiceSelect={handleBankInvoiceSelect}
          onCustomPaymentSelect={handleCustomPaymentSelect}
        />
      ) : stage === PaymentStage.EXTRA_DATA ? (
        <ExtraData
          onDeselectPayment={handleChangePaymentMethod}
          cardType={cardType}
          onSubmit={handleExtraDataSubmit}
          onChangeInstallments={() => setInstallmentsModalOpen(true)}
          onBillingAddressChange={handleBillingAddressChange}
          onDocumentChange={handleDocumentChange}
        />
      ) : null}
      <InstallmentsModal
        isOpen={installmentsModalOpen}
        onInstallmentSelected={handleInstallmentSelected}
        onClose={() => setInstallmentsModalOpen(false)}
      />
    </>
  )
}

export default Payment
