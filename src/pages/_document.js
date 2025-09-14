import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" type="image/png" href="/assets/asset/logo.png" />
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simplebar@5.3.3/dist/simplebar.min.css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.1.0-beta.1/css/select2.min.css" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* External Scripts */}
        <Script src="/assets/libs/jquery/dist/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/app.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/app.init.js" strategy="lazyOnload" />
        <Script src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/assets/libs/simplebar/dist/simplebar.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/sidebarmenu.js" strategy="lazyOnload" />
        <Script src="/assets/js/theme.js" strategy="lazyOnload" />
      </body>
    </Html>
  );
}
