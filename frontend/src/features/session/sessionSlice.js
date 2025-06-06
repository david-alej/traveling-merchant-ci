import { createSlice } from "@reduxjs/toolkit"

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    merchantName: "",
    headers: {},
  },
  reducers: {
    successfulLogin: (state, { payload: { merchantName, csrfToken } }) => {
      state.merchantName = merchantName
      state.headers["x-csrf-token"] = csrfToken
    },
    clearSession: (state) => {
      state.merchantName = ""
      state.headers = {}
    },
  },
})

export const { successfulLogin, clearSession } = sessionSlice.actions

export const selectCurrentMerchant = (state) => state.session.merchantName

export default sessionSlice.reducer
