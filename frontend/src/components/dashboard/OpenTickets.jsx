import { getPartialColumns } from "../../util/filters-util"
import { useGetDataQuery } from "../../util/query-util"
import Table from "../../features/filters/Table"
import QueryResults from "../QueryResults"

export default function OpenTickets() {
  const route = "tickets"
  const columns = getPartialColumns(route)

  const {
    data: tickets,
    isSuccess: isSuccess,
    ...queryResults
  } = useGetDataQuery(route, {
    pending: true,
  })

  return isSuccess ? (
    <div className="open-tickets">
      <h2>Open Tickets</h2>
      <Table route={route} columns={columns} data={tickets} />
    </div>
  ) : (
    <QueryResults {...queryResults} />
  )
}
