import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const tagTypes = [
  "Ticket",
  "Transaction",
  "Client",
  "Work",
  "Ware",
  "Order",
  "Provider",
]

export const rootSplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    tagTypes,
    keepUnusedDataFor: 10,
    prepareHeaders: (headers, { getState }) => {
      const resHeaders = getState().session.headers

      Object.entries(resHeaders).forEach(([resHeader, val]) => {
        headers.set(resHeader, val)
      })

      return headers
    },
    credentials: "include",
    responseHandler: async (response) => {
      const contentType = response.headers.get("Content-Type")

      if (contentType?.includes("application/json")) {
        return response.json()
      }

      return response.text()
    },
  }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: `login`,
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: `logout`,
        method: "POST",
      }),
    }),
  }),
})
