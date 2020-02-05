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
        src={'https://io.vtexpayments.com.br/card-form-ui/0.1.0/index.html'}
        onLoad={handleLoad}
        ref={iframeRef}
      />
      {iframeData && <p>{JSON.stringify(iframeData)}</p>}
    </div>
  )
}

export default Payment
