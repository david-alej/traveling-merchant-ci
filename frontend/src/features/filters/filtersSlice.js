import { createSlice } from "@reduxjs/toolkit"
import routesColumnsDefinitions from "../../util/routesColumnDefinitions"

const createInitialState = () => {
  const initialState = {}

  for (const route in routesColumnsDefinitions) {
    const routeColDefs = routesColumnsDefinitions[route]

    initialState[route] = routeColDefs.map((def) => {
      const {
        accessorKey: id,
        meta: { dataType },
      } = def
      let value = ["", ""]

      if (dataType === "itr") {
        value = []
      } else if (
        dataType === "str" ||
        dataType === "type" ||
        dataType === "obj"
      ) {
        value = ""
      }

      if ((id === "ticket" || id === "order") && route === "transactions") {
        value = ["", ""]
      }

      return { id, value }
    })
  }

  return initialState
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState: createInitialState(),
  reducers: {
    changeValue: (state, { payload: { route, id, value } }) => {
      const routeFilters = state[route]
      routeFilters.forEach((f) => {
        if (f.id === id) f.value = value

        return f
      })
    },
    addValue: (state, { payload: { route, id, value } }) => {
      const routeFilters = state[route]
      routeFilters.forEach((f) => {
        if (f.id === id && !f.value.includes(value)) {
          f.value.push(value)
        }

        return f
      })
    },
    removeValue: (state, { payload: { route, id, value } }) => {
      const routeFilters = state[route]
      routeFilters.forEach((f) => {
        if (f.id === id && f.value.includes(value)) {
          const indexToRemove = f.value.indexOf(value)

          if (indexToRemove > -1) f.value.splice(indexToRemove, 1)
        }

        return f
      })
    },
    changeExtremaValue: (
      state,
      { payload: { route, id, value, extremaType } }
    ) => {
      const routeFilters = state[route]
      const extremaIdx = extremaType === "min" ? 0 : 1

      routeFilters.forEach((f) => {
        if (f.id === id) f.value[extremaIdx] = value

        return f
      })
    },
  },
})

export const { changeValue, addValue, removeValue, changeExtremaValue } =
  filtersSlice.actions

export const selectAllFilters = (state) => state.filters

export const selectRouteFilters = (route) => (state) => state.filters[route]

export default filtersSlice.reducer
