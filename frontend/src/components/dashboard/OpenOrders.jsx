import { getPartialColumns } from "../../util/filters-util"
import { useGetDataQuery } from "../../util/query-util"
import Table from "../../features/filters/Table"
import QueryResults from "../QueryResults"

export default function OpenOrders() {
  const route = "orders"
  const columns = getPartialColumns(route)

  const {
    data: orders,
    isSuccess: isSuccess,
    ...queryResults
  } = useGetDataQuery(route, {
    pending: true,
  })

  return isSuccess ? (
    <div className="open-orders">
      <h2>Open Orders</h2>
      <Table route={route} columns={columns} data={orders} />
    </div>
  ) : (
    <QueryResults {...queryResults} />
  )
}
