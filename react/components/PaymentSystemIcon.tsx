import React from 'react'

import flags from '../flags'

const PaymentSystemIcon: React.FC<{ paymentSystem?: string }> = ({
  paymentSystem,
}) => (
  <img
    src={paymentSystem ? flags[paymentSystem] : flags.NewPaymentMethod}
    alt=""
  />
)

export default PaymentSystemIcon
