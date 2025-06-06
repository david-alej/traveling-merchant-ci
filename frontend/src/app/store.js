import sessionReducer from "../features/session/sessionSlice.js"
import filtersReducer from "../features/filters/filtersSlice.js"
import bodyReducer from "../features/body/bodySlice.js"
import { rootSplitApi } from "../api/apiSlice.js"

import { configureStore } from "@reduxjs/toolkit"

export default (preloadedState) =>
  configureStore({
    preloadedState,
    reducer: {
      session: sessionReducer,
      [rootSplitApi.reducerPath]: rootSplitApi.reducer,
      filters: filtersReducer,
      body: bodyReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rootSplitApi.middleware),
  })
