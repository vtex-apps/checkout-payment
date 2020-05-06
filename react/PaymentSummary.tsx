import React from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { useFormattedPrice } from 'vtex.formatted-price'

const PaymentSummary: React.FC = () => {
  const {
    payment: { referenceValue, installments },
    cardFormData,
  } = useOrderPayment()

  const value =
    referenceValue && installments && referenceValue / 100 / installments

  const formattedValue = useFormattedPrice(value)

  if (!installments || !value || !cardFormData) {
    return null
  }

  return (
    <div className="c-muted-1 flex flex-column">
      <span className="dib">
        Cartão de crédito terminando em {cardFormData.lastDigits}
      </span>
      <span className="dib">
        {installments} x {formattedValue} - sem juros
      </span>
    </div>
  )
}

export default PaymentSummary
