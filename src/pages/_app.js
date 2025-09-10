import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    function handleColorTheme(theme) {
      document.documentElement.setAttribute("data-color-theme", theme);
      const el = document.querySelector(`[value="${theme}"]`);
      if (el) el.checked = true;
    }

    handleColorTheme("light");

    return () => {
      // cleanup kalau nanti ada event tambahan
    };
  }, []);

  return <Component {...pageProps} />;
}
