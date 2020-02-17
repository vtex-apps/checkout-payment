import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSSR, useRuntime } from 'vtex.render-runtime'
import { Button, Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

if (window && window.document) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  var postRobot = require('post-robot')
}

interface Card {
  cardNumber: string
  cardName: string
  cardDate: string
  cardCvv: string
}

const IFRAME_APP_VERSION = '0.1.1'
const LOCAL_IFRAME_DEVELOPMENT = true

let iframeURL = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`

if (LOCAL_IFRAME_DEVELOPMENT) {
  const PORT = 3000
  iframeURL = `https://checkoutio.vtexlocal.com.br:${PORT}/`
}

const Payment: React.FC = () => {
  const [iframeLoading, setIframeLoading] = useState(true)
  const [cardData, setCardData] = useState<Card | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const runtime = useRuntime()
  const { locale } = runtime.culture

  const isSSR = useSSR()

  const setupIframe = useCallback(async () => {
    const stylesheetsUrls = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')
    ).map(link => link.href)

    await postRobot.send(iframeRef.current!.contentWindow, 'setup', {
      stylesheetsUrls,
    })
    setIframeLoading(false)
  }, [])

  useEffect(() => {
    const listener = postRobot.on('card', ({ data }: { data: Card }) => {
      setCardData(data)
      return {
        status: 'ok',
      }
    })
    return () => listener.cancel()
  }, [])

  if (isSSR) {
    return null
  }

  return (
    <div className="relative">
      {iframeLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white-70 z-1 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className="flex-none">
        <div className="">
          <iframe
            title="card-form-ui"
            width="40%"
            height="350px"
            src={`${iframeURL}?locale=${locale}`}
            onLoad={() => setupIframe()}
            ref={iframeRef}
            frameBorder="0"
          />
          <div className="mt2 pa5 w-40 bg-white">
            <Button type="submit" block>
              <FormattedMessage id="checkout-payment.button.save" />
            </Button>
          </div>
          {cardData && <p>{JSON.stringify(cardData)}</p>}
        </div>
      </div>
    </div>
  )
}

export default Payment
