import { RenderContext } from 'vtex.render-runtime'

declare global {
  // eslint-disable-next-line no-redeclare
  const __RUNTIME__: RenderContext

  interface CardFormData {
    encryptedCardNumber: string
    encryptedCardHolder: string
    encryptedExpiryDate: string
    encryptedCsc: string
    lastDigits: string
    paymentSystemId: string
  }
}
