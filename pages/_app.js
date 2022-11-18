import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
//Importamos NotificationProvider de web3uikit para añadir un bonito popup que nos indique que nuestra transaccion se ha realizado con exito
import { NotificationProvider } from "web3uikit";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />;
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
