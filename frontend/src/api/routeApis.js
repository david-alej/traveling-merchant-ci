import { createEndpointOptions } from "../util/api-util"
import { tagTypes, rootSplitApi } from "./apiSlice"

const addInjectionEndpoints = (route) =>
  rootSplitApi.injectEndpoints(createEndpointOptions(route))

const makeRouteApis = () => {
  let routeApis = {}

  for (const tagType of tagTypes) {
    routeApis[`${tagType.toLowerCase()}Api`] = addInjectionEndpoints(tagType)
  }

  return routeApis
}

const routeApis = makeRouteApis()

export default routeApis
