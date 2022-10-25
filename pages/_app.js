import "../styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import TopNav from "../components/TopNav";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Liquidity Wars</title>
        <meta name="description" content="Liquidity Wars" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <TopNav />
        <Component {...pageProps} />
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
