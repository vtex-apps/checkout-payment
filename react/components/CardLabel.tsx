import React, { ReactNode } from 'react'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  label: ReactNode
  lastDigits: string
}

const CardLabel: React.FC<Props> = ({ label, lastDigits, ...props }) => {
  return (
    <span {...props}>
      {label} ∙∙∙∙ {lastDigits}
    </span>
  )
}

export default CardLabel
