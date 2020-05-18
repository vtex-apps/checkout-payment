import React from 'react'

const PageSubTitle: React.FC<{ noMargin?: boolean }> = props => {
  const { children, noMargin } = props

  return <div className={`fw5 ${noMargin ? 'pt5' : 'pv5 mb2'}`}>{children}</div>
}

export default PageSubTitle
