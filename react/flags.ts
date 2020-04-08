import Mastercard from './icons/Mastercard.svg'
import Visa from './icons/Visa.svg'
import DefaultFlag from './icons/DefaultFlag.svg'

const flags: { [paymentSystem: string]: string } = {
  '4': Mastercard,
  '2': Visa,
  DefaultFlag,
}

export default flags
