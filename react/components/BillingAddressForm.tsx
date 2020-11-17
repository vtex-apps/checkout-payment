import React from 'react'
import { ShippingHeader } from 'vtex.checkout-shipping'
import { LocationInput, AddressForm } from 'vtex.place-components'
import { AddressContext, Utils } from 'vtex.address-context'

const { useAddressContext } = AddressContext

export const createEmptyBillingAddress = () => {
  const { receiverName, ...address } = Utils.createEmptyAddress(true)

  return address
}

const BillingAddressForm: React.VFC = () => {
  const { invalidFields, setAddress } = useAddressContext()

  return (
    <>
      {invalidFields.includes('postalCode') ? (
        <>
          <ShippingHeader />
          <LocationInput />
        </>
      ) : (
        <AddressForm
          onResetAddress={() => setAddress(createEmptyBillingAddress())}
        />
      )}
    </>
  )
}

export default BillingAddressForm
