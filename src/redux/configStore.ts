import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import storage from "redux-persist/lib/storage";

import { namespace as AddressNamespace } from "./address/slice";
import { namespace as AuthenticationNamespace } from "./authentication/slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [AddressNamespace, AuthenticationNamespace],
  blacklist: [],
};

const root = persistReducer(persistConfig, rootReducer);
export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: root,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["payload.callback"],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store, {});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
