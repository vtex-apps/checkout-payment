// eslint-disable-next-line import/order
import * as Styleguide from 'vtex.styleguide'

declare module 'vtex.styleguide' {
  import React from 'react'

  export const Button: React.FC<{ type?: string; block?: boolean }>

  export const Spinner: React.FC
}
