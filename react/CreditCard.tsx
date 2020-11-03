import classNames from 'classnames'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { DocumentField } from 'vtex.document-field'
import { useIntl, defineMessages } from 'react-intl'
import { PaymentSystem } from 'vtex.checkout-graphql'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'

import { PaymentType } from './enums/PaymentEnums'
import styles from './CreditCard.css'
import CardSummary from './CardSummary'

const messages = defineMessages({
  requiredField: {
    id: 'store/checkout-payment.requiredField',
  },
  invalidDigits: {
    id: 'store/checkout-payment.invalidDigits',
  },
  documentLabel: {
    id: 'store/checkout-payment.documentLabel',
  },
  installmentsButton: {
    id: 'store/checkout-payment.installmentsButton',
  },
})

let postRobot: typeof import('post-robot') | null = null
let iFrameResize: typeof import('iframe-resizer') | null = null

if (window?.document) {
  postRobot = require('post-robot')
  iFrameResize = require('iframe-resizer').iframeResize
}

interface Field {
  value: string
  error: boolean
  errorMessage: string
  showError: boolean
}

const IFRAME_APP_VERSION = '0.7.1'
const PORT = 3000

const iframeURLProd = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`
const iframeURLDev = `https://checkoutio.vtexlocal.com.br:${PORT}/`

const { production, query } = __RUNTIME__

const LOCAL_IFRAME_DEVELOPMENT =
  !production && query.__localCardUi !== undefined

const iframeURL = LOCAL_IFRAME_DEVELOPMENT ? iframeURLDev : iframeURLProd

const initialDoc = {
  value: '',
  error: false,
  errorMessage: '',
  showError: false,
}

interface Props {
  onCardFormCompleted: () => void
  onChangePaymentMethod: () => void
  cardType: CardType
}

const CreditCard: React.FC<Props> = ({
  onCardFormCompleted,
  onChangePaymentMethod,
  cardType,
}) => {
  const {
    cardLastDigits,
    payment,
    paymentSystems,
    setCardLastDigits,
    setPaymentField,
    referenceValue,
  } = useOrderPayment()
  const {
    orderForm: {
      shipping: { selectedAddress },
    },
  } = useOrderForm()
  const [iframeLoading, setIframeLoading] = useState(true)

  const [
    selectedPaymentSystem,
    setSelectedPaymentSystem,
  ] = useState<PaymentSystem | null>(null)

  const [doc, setDoc] = useState<Field>(initialDoc)

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
    iFrameResize?.(
      {
        heightCalculationMethod: 'max',
        checkOrigin: false,
        resizeFrom: 'parent',
        autoResize: true,
      },
      iframeRef.current!
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

  const showCardErrors = useCallback(async () => {
    await postRobot.send(iframeRef.current!.contentWindow, 'showCardErrors')
  }, [])

  const resetCardFormData = useCallback(async () => {
    if (iframeRef.current) {
      await postRobot.send(iframeRef.current.contentWindow, 'resetCardFormData')
    }
    setDoc(initialDoc)
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

  useEffect(
    function updateAddressId() {
      if (iframeRef.current) {
        postRobot.send(iframeRef.current.contentWindow, 'updateAddressId', {
          addressId: selectedAddress?.addressId,
        })
      }
    },
    [selectedAddress]
  )

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
    const docIsValid = validateDoc()
    const { data: cardIsValid } = await postRobot.send(
      iframeRef.current!.contentWindow,
      'isCardValid'
    )

    if (
      !selectedPaymentSystem ||
      !cardIsValid ||
      (cardType === 'new' && !docIsValid)
    ) {
      showCardErrors()
      return
    }

    if (cardType === 'new') {
      const { data: lastDigits } = await postRobot.send(
        iframeRef.current!.contentWindow,
        'getCardLastDigits'
      )

      setCardLastDigits(lastDigits)

      await setPaymentField({
        paymentSystem: selectedPaymentSystem.id,
        referenceValue,
        installments: null,
      })
    }

    onCardFormCompleted()
  }

  const handleChangeDoc = (data: any) => {
    setDoc({
      value: data.document,
      error: !data.isValid,
      errorMessage: '',
      showError: false,
    })
  }

  const handleCardSummaryClick = async () => {
    resetCardFormData()
    onChangePaymentMethod()
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
      <div className="mb3">
        <CardSummary
          paymentSystem={
            cardType === 'saved' ? payment.paymentSystem! : undefined
          }
          lastDigits={cardType === 'saved' ? cardLastDigits : undefined}
          onClick={handleCardSummaryClick}
          type={PaymentType.CREDIT_CARD}
        />
      </div>

      <iframe
        id="chk-card-form"
        className={classNames(styles.iframe, 'vw-100 w-auto-ns nh5 nh0-ns', {
          [styles.newCard]: cardType === 'new',
          [styles.savedCard]: cardType === 'saved',
        })}
        title="card-form-ui"
        // The scrolling attribute is set to 'no' in the iframe tag, as older versions of IE don't allow
        // this to be turned off in code and can just slightly add a bit of extra space to the bottom
        // of the content that it doesn't report when it returns the height.
        scrolling="no"
        frameBorder="0"
        src={`${iframeURL}?locale=${locale}&cardType=${cardType}`}
        onLoad={() => setupIframe()}
        ref={iframeRef}
      />

      {cardType === 'new' && (
        <div className="ph0 ph5-ns pv5 flex items-center">
          <div className="w-100 mw-100 mw5-ns">
            <DocumentField
              label={intl.formatMessage(messages.documentLabel)}
              documentType="cpf"
              onChange={handleChangeDoc}
              onBlur={validateDoc}
              document={doc.value}
              error={doc.showError && doc.error}
              errorMessage={doc.showError && doc.errorMessage}
            />
          </div>
        </div>
      )}
      <div className="flex mt5">
        <Button size="large" block onClick={handleSubmit}>
          <span className="f5">
            {intl.formatMessage(messages.installmentsButton)}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default CreditCard
