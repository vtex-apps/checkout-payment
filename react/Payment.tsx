import React, { useState } from 'react'

import CreditCard from './components/CreditCard'
import Installments from './components/Installments'

enum Step {
  InstallmentsStep,
  CreditCardFormStep,
}

const Payment: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.CreditCardFormStep)
  const [cardFormData, setCardFormData] = useState<CardFormData | null>(null)

  const onCardFormCompleted = (cardForm: CardFormData) => {
    setCardFormData(cardForm)
    setStep(Step.InstallmentsStep)
  }

  return (
    <>
      {step === Step.CreditCardFormStep ? (
        <CreditCard onCardFormCompleted={onCardFormCompleted} />
      ) : (
        <Installments
          paymentSystem={cardFormData!.paymentSystemId}
          lastDigits={cardFormData!.lastDigits}
        />
      )}
    </>
  )
}

export default Payment
