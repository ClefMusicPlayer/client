import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
           function (registration) {
             console.log("[SW] Registered with scope : ", registration.scope);
           },
           function (err) {
             console.log("[SW] Registration failed! : ", err);
           }
         );
       });
    }
  })
  return <>
    <Head>
      <link rel="manifest" href="/manifest.json" />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
