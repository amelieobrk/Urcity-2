import { SessionProvider } from "next-auth/react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import "../styles/globals.css"

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) { //Session die ganze zeit rumpassen, diese Seite wird geladen jedes Mal wnen aufgerufen
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
