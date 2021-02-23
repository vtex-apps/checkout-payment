import React, { useState, useMemo, useEffect } from 'react'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { defineMessages, useIntl } from 'react-intl'
import { Button, Dropdown } from 'vtex.styleguide'
import { DocumentField } from 'vtex.document-field'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { AddressContext, useAddressRules } from 'vtex.address-context'
import { Address } from 'vtex.checkout-graphql'
import { formatAddressToString, useAddressForm } from 'vtex.place-components'
import { Loading } from 'vtex.render-runtime'

import CardSummary from '../CardSummary'
import SelectedCardInstallments from './SelectedCardInstallments'
import BillingAddressForm, {
  createEmptyBillingAddress,
} from './BillingAddressForm'

const { AddressContextProvider, useAddressContext } = AddressContext

const messages = defineMessages({
  selectedPaymentLabel: { id: 'store/checkout-payment.selectedPaymentLabel' },
  creditCardExtraDataMessage: {
    id: 'store/checkout-payment.creditCardExtraDataMessage',
  },
  reviewPurchaseLabel: {
    id: 'store/checkout-payment.reviewPurchaseLabel',
  },
  documentLabel: {
    id: 'store/checkout-payment.documentLabel',
  },
  requiredField: {
    id: 'store/checkout-payment.requiredField',
  },
  invalidDigits: {
    id: 'store/checkout-payment.invalidDigits',
  },
  billingAddressLabel: {
    id: 'store/checkout-payment.billingAddressLabel',
  },
  newAddressLabel: { id: 'store/checkout-payment.newAddressLabel' },
})

interface Field {
  value: string
  error: boolean
  errorMessage: string
  showError: boolean
}

const initialDocument: Field = {
  value: '',
  error: false,
  errorMessage: '',
  showError: false,
}

const NEW_ADDRESS_VALUE = 'new'

interface Props {
  onDeselectPayment: () => void
  cardType: CardType
  onSubmit: () => void
  onChangeInstallments: () => void
  onDocumentChange: (document: string) => void
  onBillingAddressChange: (address: Address | string) => void
}

const ExtraData: React.VFC<Props> = ({
  onDeselectPayment,
  cardType,
  onSubmit,
  onChangeInstallments,
  onBillingAddressChange,
  onDocumentChange,
}) => {
  const { cardLastDigits, payment } = useOrderPayment()
  const intl = useIntl()
  const [userDocument, setDocument] = useState<Field>(initialDocument)

  const validateDocument = () => {
    if (!userDocument.value) {
      setDocument(prevDocument => ({
        ...prevDocument,
        showError: true,
        error: true,
        errorMessage: intl.formatMessage(messages.requiredField),
      }))
      return false
    }

    if (userDocument.error) {
      setDocument(prevDocument => ({
        ...prevDocument,
        showError: true,
        errorMessage: intl.formatMessage(messages.invalidDigits),
      }))
      return false
    }

    return true
  }

  const handleChangeDocument = (data: any) => {
    onDocumentChange(data.document)

    setDocument({
      value: data.document,
      error: !data.isValid,
      errorMessage: '',
      showError: false,
    })
  }

  const { orderForm } = useOrderForm()
  const { rules } = useAddressContext()

  const billingAddressesOptions = useMemo(
    () =>
      (
        orderForm.shipping.availableAddresses?.map(availableAddress => ({
          label: formatAddressToString(
            availableAddress!,
            rules[availableAddress!.country as string]
          ),
          value: availableAddress!.addressId!,
        })) ?? []
      ).concat([
        {
          label: intl.formatMessage(messages.newAddressLabel),
          value: NEW_ADDRESS_VALUE,
        },
      ]),
    [orderForm.shipping.availableAddresses, intl, rules]
  )

  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState(
    billingAddressesOptions[0].value
  )

  const billingForm = useAddressForm()

  useEffect(() => {
    const { __typename, ...addressWithoutTypename } = billingForm.address

    onBillingAddressChange(addressWithoutTypename)
  }, [billingForm.address, onBillingAddressChange])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault()

    const documentIsValid = validateDocument()

    let shouldSubmit = true

    if (cardType === 'new' && !documentIsValid) {
      shouldSubmit = false
    }

    if (
      selectedBillingAddressId === NEW_ADDRESS_VALUE &&
      !billingForm.isValid
    ) {
      billingForm.invalidFields.forEach(field => {
        billingForm.onFieldBlur(field)
      })
      shouldSubmit = false
    }

    if (!shouldSubmit) {
      return
    }

    onSubmit()
  }

  return (
    <div>
      <span className="dib t-heading-6 mb5">
        {intl.formatMessage(messages.selectedPaymentLabel)}
      </span>

      <CardSummary
        lastDigits={cardLastDigits}
        paymentSystem={payment.paymentSystem ?? undefined}
        onEdit={onDeselectPayment}
        description={
          <SelectedCardInstallments
            onChangeInstallments={onChangeInstallments}
          />
        }
      />

      <span className="dib mt5 t-body lh-copy">
        {intl.formatMessage(messages.creditCardExtraDataMessage)}
      </span>

      <form onSubmit={handleSubmit}>
        {cardType === 'new' && (
          <div className="mt6 flex items-center">
            <div className="w-100 mw-100 mw5-ns">
              <DocumentField
                label={intl.formatMessage(messages.documentLabel)}
                documentType="cpf"
                onChange={handleChangeDocument}
                onBlur={validateDocument}
                document={userDocument.value}
                error={userDocument.error && userDocument.showError}
                errorMessage={
                  userDocument.showError ? userDocument.errorMessage : ''
                }
              />
            </div>
          </div>
        )}

        <div className="mt6">
          <Dropdown
            label={intl.formatMessage(messages.billingAddressLabel)}
            options={billingAddressesOptions}
            value={selectedBillingAddressId}
            onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
              const { value } = evt.target

              setSelectedBillingAddressId(value)
              onBillingAddressChange(value)
            }}
          />

          {selectedBillingAddressId === NEW_ADDRESS_VALUE && (
            <div className="mt6">
              <BillingAddressForm form={billingForm} />
            </div>
          )}
        </div>

        <div className="mt7">
          <Button size="large" block type="submit">
            <span className="f5">
              {intl.formatMessage(messages.reviewPurchaseLabel)}
            </span>
          </Button>
        </div>
      </form>
    </div>
  )
}

const ExtraDataWithAddress: typeof ExtraData = ({ ...props }) => {
  const addressRules = useAddressRules()

  const { orderForm } = useOrderForm()

  if (addressRules == null) {
    return <Loading />
  }

  return (
    <AddressContextProvider
      address={createEmptyBillingAddress()}
      rules={addressRules}
      countries={orderForm.shipping.countries as string[]}
    >
      <ExtraData {...props} />
    </AddressContextProvider>
  )
}

export default ExtraDataWithAddress
