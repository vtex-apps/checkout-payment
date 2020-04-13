import Mastercard from './icons/Mastercard.svg'
import Visa from './icons/Visa.svg'
import NewPaymentMethod from './icons/NewPaymentMethod.svg'

const flags: { [paymentSystem: string]: string } = {
  '4': Mastercard,
  '2': Visa,
  NewPaymentMethod,
}

export default flags
