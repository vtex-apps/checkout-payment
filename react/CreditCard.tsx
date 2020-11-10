import classNames from 'classnames'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner, ButtonPlain } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import { PaymentSystem } from 'vtex.checkout-graphql'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderPayment } from 'vtex.order-payment/OrderPayment'
import { Modal } from 'vtex.checkout-components'
import { PaymentFlag } from 'vtex.payment-flags'

import defaultStyles from './styles.css'
import styles from './CreditCard.css'
import CardSummary from './CardSummary'
import SelectedCardInstallments from './components/SelectedCardInstallments'

const messages = defineMessages({
  requiredField: {
    id: 'store/checkout-payment.requiredField',
  },
  invalidDigits: {
    id: 'store/checkout-payment.invalidDigits',
  },
  doucmentLabel: {
    id: 'store/checkout-payment.documentLabel',
  },
  installmentsButton: {
    id: 'store/checkout-payment.installmentsButton',
  },
  installmentsOptionsTitle: {
    id: 'store/checkout-payment.installmentsOptionsTitle',
  },
  installmentWithoutValue: {
    id: 'store/checkout-payment.installmentWithoutValue',
  },
  selectedPaymentLabel: { id: 'store/checkout-payment.selectedPaymentLabel' },
  reviewPurchaseLabel: { id: 'store/checkout-payment.reviewPurchaseLabel' },
})

let postRobot: typeof import('post-robot') | null = null
let iFrameResize: typeof import('iframe-resizer') | null = null

if (window?.document) {
  postRobot = require('post-robot')
  iFrameResize = require('iframe-resizer').iframeResize
}

const IFRAME_APP_VERSION = '0.7.1'
const PORT = 3000

const iframeURLProd = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`
const iframeURLDev = `https://checkoutio.vtexlocal.com.br:${PORT}/`

const { production, query } = __RUNTIME__

const LOCAL_IFRAME_DEVELOPMENT =
  !production && query.__localCardUi !== undefined

const iframeURL = LOCAL_IFRAME_DEVELOPMENT ? iframeURLDev : iframeURLProd

interface Props {
  onCardFormCompleted: () => void
  onChangePaymentMethod: () => void
  onChangeInstallments: () => void
  cardType: CardType
}

const CreditCard: React.FC<Props> = ({
  onCardFormCompleted,
  onChangePaymentMethod,
  onChangeInstallments,
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
        heightCalculationMethod: 'documentElementOffset',
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

  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async () => {
    setSubmitLoading(true)

    try {
      const { data: cardIsValid } = await postRobot.send(
        iframeRef.current!.contentWindow,
        'isCardValid'
      )

      if (!selectedPaymentSystem || !cardIsValid) {
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
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCardSummaryClick = async () => {
    resetCardFormData()
    onChangePaymentMethod()
  }

  const [
    showAvailableInstallmentOptionsModal,
    setShowAvailableInstallmentOptionsModal,
  ] = useState(false)
  const { orderForm } = useOrderForm()

  const creditCardPayments = useMemo(
    () =>
      orderForm.paymentData.paymentSystems.filter(
        ({ groupName }) => groupName === 'creditCardPaymentGroup'
      ),
    [orderForm]
  )

  const creditCardInstallmentOptions = useMemo(
    () =>
      creditCardPayments
        .map(creditCardPaymentSystem => {
          const creditCardInstallments = orderForm.paymentData.installmentOptions.find(
            installmentOption =>
              creditCardPaymentSystem.id === installmentOption.paymentSystem
          )

          if (!creditCardInstallments) {
            return null
          }

          return {
            ...creditCardInstallments,
            paymentName: creditCardPaymentSystem.name,
          }
        })
        .filter(<T extends any>(value: T | null): value is T => value !== null),
    [orderForm, creditCardPayments]
  )

  if (isSSR) {
    return null
  }

  return (
    <div className="relative w-100">
      <span className="dib t-heading-6 mb5">
        {intl.formatMessage(messages.selectedPaymentLabel)}
      </span>

      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className={cardType === 'saved' ? 'mb5' : 'mb3'}>
        <CardSummary
          paymentSystem={
            cardType === 'saved' ? payment.paymentSystem! : undefined
          }
          lastDigits={cardType === 'saved' ? cardLastDigits : undefined}
          onEdit={handleCardSummaryClick}
          description={
            cardType === 'saved' ? (
              <SelectedCardInstallments
                onChangeInstallments={onChangeInstallments}
              />
            ) : (
              <div className="pv3">
                <ButtonPlain
                  onClick={() => setShowAvailableInstallmentOptionsModal(true)}
                >
                  Ver opções de parcelamento
                </ButtonPlain>
              </div>
            )
          }
        />
        <Modal
          isOpen={showAvailableInstallmentOptionsModal}
          onClose={() => setShowAvailableInstallmentOptionsModal(false)}
          title={intl.formatMessage(messages.installmentsOptionsTitle)}
        >
          {creditCardInstallmentOptions.map(
            ({ paymentSystem: paymentSystemId, installments, paymentName }) => (
              <div key={paymentSystemId} className="flex mb4">
                <div className="flex w2 h2">
                  <PaymentFlag paymentSystemId={paymentSystemId} />
                </div>
                <div className="ml5">
                  <span className="t-base fw7">{paymentName}</span>
                  <ul className="list pa0 mb0 mt3">
                    {installments.map(installment => (
                      <li key={installment.count} className="lh-copy mb3">
                        {intl.formatMessage(messages.installmentWithoutValue, {
                          count: installment.count,
                          hasInterestRate: installment.hasInterestRate,
                          interestRate: installment.interestRate,
                        })}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </Modal>
      </div>

      <iframe
        id="chk-card-form"
        className={classNames(
          defaultStyles.fullWidth,
          styles.iframe,
          'nl5 nh0-ns',
          {
            [styles.newCard]: cardType === 'new',
            [styles.savedCard]: cardType === 'saved',
          }
        )}
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

      <div className="flex mt5">
        <Button
          size="large"
          block
          onClick={handleSubmit}
          isLoading={submitLoading}
        >
          <span className="f5">
            {intl.formatMessage(
              cardType === 'saved'
                ? messages.reviewPurchaseLabel
                : messages.installmentsButton
            )}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default CreditCard
