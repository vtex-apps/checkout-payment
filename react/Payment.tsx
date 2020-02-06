import React, { useState, useRef, useEffect } from 'react'

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
const PORT = 3001

let iframeURL = `https://io.vtexpayments.com.br/card-form-ui/${IFRAME_APP_VERSION}/index.html`

if (LOCAL_IFRAME_DEVELOPMENT) {
  iframeURL = `https://checkoutio.vtexlocal.com.br:${PORT}/`
}

interface Card {
  cardNumber: string
  cardName: string
  cardDate: string
  cardCvv: string
}

const Payment: React.FC = () => {
  const [iframeData, setIframeData] = useState<Card | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const setupIframe = () => {
    const stylesheetsUrls = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')
    ).map(link => link.href)

    postRobot.send(iframeRef.current!.contentWindow, 'setup', {
      stylesheetsUrls,
    })
  }

  const handleLoad = () => {
    setupIframe()
  }

  useEffect(() => {
    const listener = postRobot.on('card', ({ data }: { data: Card }) => {
      setIframeData(data)
      return {
        status: 'ok',
      }
    })
    return () => listener.cancel()
  })

  return (
    <div>
      <iframe
        title="card-form-ui"
        width="400px"
        height="300px"
        src={iframeURL}
        onLoad={handleLoad}
        ref={iframeRef}
      />
      {iframeData && <p>{JSON.stringify(iframeData)}</p>}
    </div>
  )
}

export default Payment
