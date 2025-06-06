import routeApis from "../api/routeApis"

export const getRouteApi = (route) => {
  return routeApis[route.toLowerCase().slice(0, -1) + "Api"]
}

export const useGetDataQuery = (route, body = {}) => {
  const routeApi = getRouteApi(route)

  return routeApi[`useGet${route[0].toUpperCase() + route.slice(1)}Query`](
    body,
    { refetchOnMountOrArgChange: true }
  )
}

export const useGetDatumQuery = (route, id) => {
  const routeApi = getRouteApi(route)

  return routeApi[`useGet${route[0].toUpperCase() + route.slice(1, -1)}Query`](
    id,
    { refetchOnMountOrArgChange: true }
  )
}

export const useUpdateDataMutation = (route) => {
  const routeApi = getRouteApi(route)

  return routeApi[
    `useUpdate${route[0].toUpperCase() + route.slice(1, -1)}Mutation`
  ]()
}

export const useCreateDataMutation = (route) => {
  const routeApi = getRouteApi(route)

  return routeApi[
    `useCreate${route[0].toUpperCase() + route.slice(1, -1)}Mutation`
  ]()
}

export const useDeleteDataMutation = (route) => {
  const routeApi = getRouteApi(route)

  return routeApi[
    `useDelete${route[0].toUpperCase() + route.slice(1, -1)}Mutation`
  ]()
}
