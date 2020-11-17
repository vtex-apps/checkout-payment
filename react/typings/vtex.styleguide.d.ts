declare module 'vtex.styleguide' {
  import React, { ReactNode } from 'react'

  export const Button: React.FC<{ type?: string; block?: boolean }>

  export const Spinner: React.FC

  export const Input: React.FC

  export const IconEdit: React.FC

  export const Alert: React.FC<{ type: 'success' | 'warning' | 'error' }>

  export const Dropdown: React.VFC<{
    label: string
    options: Array<{ value: string; label: string }>
    placeholder?: string
    error?: boolean
    errorMessage?: ReactNode
    value?: string
  } & React.HTMLAttributes<HTMLSelectElement>>
}

export {}
