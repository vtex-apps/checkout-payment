import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { DocumentField } from 'vtex.document-field'
import { useIntl, defineMessages } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { PaymentSystem } from 'vtex.checkout-graphql'

import { PaymentType } from './enums/PaymentEnums'
// import SavedCard from './SavedCard'
import styles from './CreditCard.css'
import CardSummary from './CardSummary'

const messages = defineMessages({
  requiredField: {
    id: 'checkout-payment.requiredField',
  },
  invalidDigits: {
    id: 'checkout-payment.invalidDigits',
  },
  doucmentLabel: {
    id: 'checkout-payment.documentLabel',
  },
  installmentsButton: {
    id: 'checkout-payment.installmentsButton',
  },
})

let postRobot: any = null
let iFrameResize: any = null
if (window?.document) {
  postRobot = require('post-robot')
  iFrameResize = require('iframe-resizer/js/iframeResizer')
}

interface Field {
  value: string
  error: boolean
  errorMessage: string
  showError: boolean
}

interface EncryptedCard {
  encryptedCardNumber: string
  encryptedCardHolder: string
  encryptedExpiryDate: string
  encryptedCsc: string
  lastDigits: string
}

interface Props {
  onCardFormCompleted: (cardForm: CardFormData) => void
  backToPaymentList: () => void
}

const IFRAME_APP_VERSION = '0.5.2'
const PORT = 3000

const iframeURLProd = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`
const iframeURLDev = `https://checkoutio.vtexlocal.com.br:${PORT}/`

const { production, query } = __RUNTIME__

const LOCAL_IFRAME_DEVELOPMENT =
  !production && query.__localCardUi !== undefined

const iframeURL = LOCAL_IFRAME_DEVELOPMENT ? iframeURLDev : iframeURLProd

const CreditCard: React.FC<Props> = ({
  onCardFormCompleted,
  backToPaymentList,
}) => {
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
    error: false,
    errorMessage: '',
    showError: false,
  })

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const {
    culture: { locale },
  } = useRuntime()
  const isSSR = useSSR()
  const intl = useIntl()

  const creditCardPaymentSystems = useMemo(
    () =>
      paymentSystems.filter(
        (paymentSystem: PaymentSystem) =>
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

  useEffect(function createPaymentSystemListener() {
    const listener = postRobot.on(
      'paymentSystem',
      ({ data }: { data: PaymentSystem }) => {
        setSelectedPaymentSystem(data)
      }
    )
    return () => listener.cancel()
  }, [])

  const validateDoc = () => {
    if (!doc.value) {
      setDoc({
        ...doc,
        showError: true,
        error: true,
        errorMessage: intl.formatMessage(messages.requiredField),
      })
      return false
    }
    if (doc.error) {
      setDoc({
        ...doc,
        showError: true,
        errorMessage: intl.formatMessage(messages.invalidDigits),
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    const encryptedCard = await getEncryptedCard()
    const docIsValid = validateDoc()

    if (!selectedPaymentSystem || !encryptedCard || !docIsValid) {
      return
    }

    onCardFormCompleted({
      ...encryptedCard,
      paymentSystem: selectedPaymentSystem.id,
    })
  }

  const handleChangeDoc = (data: any) => {
    setDoc({
      value: data.document,
      error: !data.isValid,
      errorMessage: '',
      showError: false,
    })
  }

  if (isSSR) {
    return null
  }

  return (
    <div className="relative w-100">
      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className="mb4">
        <CardSummary
          onClick={() => backToPaymentList()}
          type={PaymentType.CREDIT_CARD}
        />
      </div>
      <div className="w-100">
        <iframe
          className={styles.iframe}
          title="card-form-ui"
          /* The scrolling attribute is set to 'no' in the iframe tag, as older versions of IE don't allow
          this to be turned off in code and can just slightly add a bit of extra space to the bottom
          of the content that it doesn't report when it returns the height. */
          scrolling="no"
          frameBorder="0"
          src={`${iframeURL}?locale=${locale}`}
          onLoad={() => setupIframe()}
          ref={iframeRef}
        />
      </div>
      <div className="pa5 w-50 flex items-center justify-center">
        <DocumentField
          label={intl.formatMessage(messages.doucmentLabel)}
          documentType="cpf"
          onChange={handleChangeDoc}
          onBlur={validateDoc}
          document={doc.value}
          error={doc.showError && doc.error}
          errorMessage={doc.showError && doc.errorMessage}
          size="large"
        />
      </div>
      <div className="flex mt5 f5">
        <Button size="large" block onClick={handleSubmit}>
          {intl.formatMessage(messages.installmentsButton)}
        </Button>
      </div>
    </div>
  )
}

export default CreditCard
