// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    const isDev = process.env.NODE_ENV === 'development';
    return (
      <Html lang="en">
        <Head>
          {/* Content Security Policy */}
          <meta
            httpEquiv="Content-Security-Policy"
            content={
              isDev
                ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; frame-src https://*.razorpay.com; connect-src 'self' https://api.razorpay.com; img-src 'self' data:;"
                : "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; frame-src https://*.razorpay.com; connect-src 'self' https://api.razorpay.com; img-src 'self' data:;"
            }
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
