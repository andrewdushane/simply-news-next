import "./_app.css";
import smoothscroll from "smoothscroll-polyfill";

if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

export default function AppContainer({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
