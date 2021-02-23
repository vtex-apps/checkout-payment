import React from 'react'
import {
  LocationInput,
  AddressForm,
  useAddressForm,
} from 'vtex.place-components'
import { Utils } from 'vtex.address-context'
import { FormattedMessage } from 'react-intl'

export const createEmptyBillingAddress = () => {
  const { receiverName, ...address } = Utils.createEmptyAddress(true)

  return address
}

const BillingAddressForm: React.VFC<{
  form: ReturnType<typeof useAddressForm>
}> = ({ form }) => {
  return (
    <>
      {form.invalidFields.includes('postalCode') ? (
        <>
          <p className="t-body mt0 mb6">
            <FormattedMessage id="store/checkout-payment.informBillingAddress" />
          </p>
          <LocationInput onSuccess={address => form.setAddress(address)} />
        </>
      ) : (
        <AddressForm
          onResetAddress={() => form.setAddress(createEmptyBillingAddress())}
          form={form}
        />
      )}
    </>
  )
}

export default BillingAddressForm
