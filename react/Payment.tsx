import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner, Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import msk from 'msk'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

let postRobot: any = null
let iFrameResize: any = null
if (window?.document) {
  postRobot = require('post-robot')
  iFrameResize = require('iframe-resizer/js/iframeResizer')
}

interface Field {
  value: string
  error: string | null
}

interface EncryptedCard {
  encryptedCardNumber: string
  encryptedCardHolder: string
  encryptedExpiryDate: string
  encryptedCsc: string
}

interface Validator {
  regex: string
  mask: string
  cardCodeRegex: string
  cardCodeMask: string
  weights: number[]
  useExpirationDate: boolean
  useCardHolderName: boolean
  useBillingAddress: boolean
}
interface PaymentSystem {
  id: number
  name: string
  validator: Validator
}

const IFRAME_APP_VERSION = '0.3.0'
const LOCAL_IFRAME_DEVELOPMENT = true

let iframeURL = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`

if (LOCAL_IFRAME_DEVELOPMENT) {
  const PORT = 3000
  iframeURL = `https://checkoutio.vtexlocal.com.br:${PORT}/`
}

const getPaymentData = (
  {
    encryptedCardHolder,
    encryptedCardNumber,
    encryptedCsc,
    encryptedExpiryDate,
  }: EncryptedCard,
  selectedPaymentSystem: PaymentSystem,
  document: string
) => {
  return {
    paymentSystem: selectedPaymentSystem.name,
    cardHolder: encryptedCardHolder,
    cardNumber: encryptedCardNumber,
    csc: encryptedCsc,
    expiryDate: encryptedExpiryDate,
    document,
    documentType: 'CPF',
    partnerId: '12345',
    address: {
      postalCode: '22775-130',
      street: 'Rua Jaime Poggi',
      neighborhood: 'Jacarepagua',
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'BRA',
      number: '5001',
      complement: 'Apto 007',
    },
  }
}

const Payment: React.FC = () => {
  const {
    orderForm: {
      paymentData: { paymentSystems },
    },
  } = useOrderForm()
  const [iframeLoading, setIframeLoading] = useState(true)
  const [
    selectedPaymentSystem,
    setSelectedPaymentSystem,
  ] = useState<PaymentSystem | null>(null)
  const [doc, setDoc] = useState<Field>({
    value: '',
    error: null,
  })

  const [loading, setLoading] = useState(false)
  const [savedCard, setSavedCard] = useState<any>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const runtime = useRuntime()
  const {
    culture: { locale },
  } = runtime

  const isSSR = useSSR()

  const { savePaymentData } = useOrderPayment()

  const creditCardPaymentSystems = useMemo(
    () =>
      paymentSystems.filter(
        (paymentSystem: any) =>
          paymentSystem.groupName === 'creditCardPaymentGroup'
      ),
    [paymentSystems]
  )

  const setupIframe = useCallback(async () => {
    iFrameResize(
      {
        heightCalculationMethod: 'max',
        checkOrigin: false,
        resizeFrom: 'parent',
        autoResize: true,
      },
      iframeRef.current
    )

    const stylesheetsUrls = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')
    ).map(link => link.href)

    await postRobot.send(iframeRef.current!.contentWindow, 'setup', {
      stylesheetsUrls,
      paymentSystems: creditCardPaymentSystems,
    })
    setIframeLoading(false)
  }, [creditCardPaymentSystems])

  const getEncryptedCard = useCallback(async (): Promise<EncryptedCard | null> => {
    const { data } = await postRobot.send(
      iframeRef.current!.contentWindow,
      'encryptedCard'
    )
    return data
  }, [])

  useEffect(() => {
    const listener = postRobot.on(
      'paymentSystem',
      ({ data }: { data: PaymentSystem }) => {
        setSelectedPaymentSystem(data)
      }
    )
    return () => listener.cancel()
  }, [])

  useEffect(() => {
    if (savedCard) {
      setLoading(false)
    }
  }, [savedCard])

  const handleSubmit = async () => {
    const encryptedCard = await getEncryptedCard()

    if (!selectedPaymentSystem || !encryptedCard) {
      return
    }

    setLoading(true)
    const paymentData = getPaymentData(
      encryptedCard,
      selectedPaymentSystem,
      doc.value
    )
    const newSavedCard = await savePaymentData([paymentData])
    setSavedCard(newSavedCard)
  }

  const handleDoc = (evt: any) => {
    setDoc({ ...doc, value: evt.target.value })
  }

  const handleBlurDoc = () => {
    setDoc((prevDoc: any) => ({
      ...prevDoc,
      value: msk.fit(prevDoc.value, '999.999.999-99'),
    }))
  }

  if (isSSR) {
    return null
  }

  // The card was saved
  if (savedCard && !savedCard.error) {
    return <div>{JSON.stringify(savedCard.value)}</div>
  }

  return (
    <div className="relative w-100">
      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <iframe
        title="card-form-ui"
        // Using min-width to set the width of the iFrame, works around an issue in iOS that can prevent the iFrame from sizing correctly.
        style={{ minWidth: '100%', minHeight: '200px' }}
        // The scrolling attribute is set to 'no' in the iFrame tag, as older versions of IE don't allow this to be turned off in code and can just slightly add a bit of extra space to the bottom of the content that it doesn't report when it returns the height.
        scrolling="no"
        frameBorder="0"
        src={`${iframeURL}?locale=${locale}`}
        onLoad={() => setupIframe()}
        ref={iframeRef}
      />
      <div className="pa5 w-50 flex items-center justify-center">
        <Input
          size="large"
          value={doc.value}
          name="cpf"
          label={<FormattedMessage id="checkout-payment.input.document" />}
          onChange={handleDoc}
          onBlur={handleBlurDoc}
        />
      </div>
      <div className="flex mt5">
        <Button block disabled={loading} onClick={handleSubmit}>
          {loading ? (
            <Spinner size={24} />
          ) : (
            <FormattedMessage id="checkout-payment.button.save" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default Payment
