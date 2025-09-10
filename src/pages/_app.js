import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    function handleColorTheme(e) {
      document.documentElement.setAttribute("data-color-theme", e);
      const el = document.querySelector(e);
      if (el) el.checked = true;
    }
    document.addEventListener("DOMContentLoaded", () => {
      handleColorTheme("light");
    });

    return () => {
      document.removeEventListener("DOMContentLoaded", handleColorTheme);
    };
  }, []);

  return <Component {...pageProps} />;
}
