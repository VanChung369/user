"use client";
import { FC, lazy, Suspense, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
const isDev = process.env.NODE_ENV === "development";
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

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

  const currentMessages = useMemo(() => messages[locale], [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      {isDev ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      ) : null}
      <IntlProvider locale={locale} messages={currentMessages}>
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
