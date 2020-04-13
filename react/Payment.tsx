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

  const backToCreditCard = () => {
    setStep(Step.CreditCardFormStep)
  }

  return (
    <>
      <div className={step === Step.CreditCardFormStep ? '' : 'dn'}>
        <CreditCard onCardFormCompleted={onCardFormCompleted} />
      </div>
      {step === Step.InstallmentsStep ? (
        <Installments
          backToCreditCard={backToCreditCard}
          lastDigits={cardFormData!.lastDigits}
        />
      ) : null}
    </>
  )
}

export default Payment
