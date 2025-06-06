import columnDefinitions from "./columnDefinitions"
import ParentRoute from "../../components/ParentRoute"
import Datum from "./Datum"
import Data from "./Data"

import { Route } from "react-router-dom"

const createRoutes = () => {
  const routes = {}

  for (const column in columnDefinitions) {
    const columnDef = columnDefinitions[column]

    routes.push(
      <Route path={column} element={<ParentRoute columns={columnDef} />}>
        <Route index path="" element={<Datum />} />
        <Route path=":id" element={<Data />} />
      </Route>
    )
  }

  return routes
}

// const routes = createRoutes()

// export default routes
