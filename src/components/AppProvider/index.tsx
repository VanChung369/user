"use client";
import { FC, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { PolygonAmoyTestnet } from "@thirdweb-dev/chains";
import { IntlProvider } from "react-intl";
import messages_en from "@/locales/en-US";
import messages_vi from "@/locales/vi-VN";
import { setTokenCallApi } from "@/utils/api";
import { namespace as AuthenticationNamespace } from "@/redux/authentication/slice";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/configStore";
import ConnectWalletWrapper from "../ConnectWallet";

type Locale = "en" | "vi";

const messages: any = {
  en: messages_en,
  vi: messages_vi,
};

const onBeforeLift: any = (store: any) => () => {
  const state = store.getState();
  setTokenCallApi(state?.[AuthenticationNamespace]?.authenticationToken);
};

const queryClient = new QueryClient();

const AppProvider: FC<{
  children: any;
}> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("language");
    if (storedLocale) {
      setLocale(storedLocale as Locale);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ThirdwebProvider
          autoConnect={true}
          clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID!}
          activeChain={PolygonAmoyTestnet}
        >
          <Provider store={store}>
            <PersistGate
              persistor={persistor}
              loading={null}
              onBeforeLift={onBeforeLift(store)}
            >
              <ConnectWalletWrapper>{children}</ConnectWalletWrapper>
            </PersistGate>
          </Provider>
        </ThirdwebProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
