export default {
  tickets: [
    {
      accessorKey: "client",
      header: "Client",
      meta: { dataType: "obj", property: "fullname", isForeign: true },
    },
    {
      accessorKey: "cost",
      header: "Cost",
      meta: { dataType: "num", isOptional: true },
    },
    {
      accessorKey: "paid",
      header: "Paid",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "returned",
      header: "Returned",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "owed",
      header: "Owed",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "paymentPlan",
      header: "Payment Plan",
      meta: { dataType: "type", isOriginal: true },
    },
    {
      accessorKey: "waresTickets",
      header: "Wares Sold",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "transactions",
      header: "Payments",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "description",
      header: "Description",
      meta: { dataType: "str", isOptional: true },
    },
  ],
  transactions: [
    {
      accessorKey: "ticket",
      header: "Ticket",
      meta: { dataType: "obj", property: "id", isForeign: true },
    },
    {
      accessorKey: "order",
      header: "Order",
      meta: { dataType: "obj", property: "id", isForeign: true },
    },
    {
      accessorKey: "payment",
      header: "payment",
      meta: { dataType: "num", isOriginal: true },
    },
    {
      accessorKey: "paymentType",
      header: "Payment Type",
      meta: { dataType: "type", isOriginal: true },
    },
    {
      accessorKey: "paidAt",
      header: "Paid At",
      meta: { dataType: "date", isOriginal: true },
    },
  ],
  clients: [
    {
      accessorKey: "work",
      header: "Work",
      meta: { dataType: "obj", property: "name", isForeign: true },
    },
    {
      accessorKey: "fullname",
      header: "Fullname",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "address",
      header: "Address",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "tickets",
      header: "Tickets",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "description",
      header: "Description",
      meta: { dataType: "str", isOptional: true },
    },
  ],
  works: [
    {
      accessorKey: "name",
      header: "Name",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "address",
      header: "Address",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "clients",
      header: "Employees",
      meta: { dataType: "arr", isForeigns: true },
    },
  ],
  wares: [
    {
      accessorKey: "name",
      header: "Name",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "type",
      header: "Type",
      meta: { dataType: "type", isOriginal: true },
      filterFn: "typeFilter",
    },
    {
      accessorKey: "tags",
      header: "Tags",
      meta: { dataType: "itr", isOptional: true },
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      meta: { dataType: "num", isOriginal: true },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      meta: { dataType: "int" },
    },
    {
      accessorKey: "ordersWares",
      header: "Bought",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "waresTickets",
      header: "Sold",
      meta: { dataType: "arr", isForeigns: true },
    },
  ],
  orders: [
    {
      accessorKey: "provider",
      header: "Provider",
      meta: { dataType: "obj", property: "name", isForeign: true },
    },
    {
      accessorKey: "cost",
      header: "Cost",
      meta: { dataType: "num", isOriginal: true },
    },
    {
      accessorKey: "tax",
      header: "Tax",
      meta: { dataType: "num", isOptional: true },
    },
    {
      accessorKey: "shipment",
      header: "Shipment",
      meta: { dataType: "num", isOptional: true },
    },
    {
      accessorKey: "paid",
      header: "Paid",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "returned",
      header: "Returned",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "owed",
      header: "Owed",
      meta: { dataType: "num" },
    },
    {
      accessorKey: "ordersWares",
      header: "Wares Bought",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "transactions",
      header: "Payments",
      meta: { dataType: "arr", isForeigns: true },
    },
    {
      accessorKey: "expectedAt",
      header: "Expected At",
      meta: { dataType: "date", isOriginal: true },
    },
    {
      accessorKey: "actualAt",
      header: "Actual At",
      meta: { dataType: "date", isOptional: true },
    },
  ],
  providers: [
    {
      accessorKey: "name",
      header: "Name",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "address",
      header: "Address",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
      meta: { dataType: "str", isOriginal: true },
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { dataType: "str", isOptional: true },
    },
    {
      accessorKey: "orders",
      header: "Orders",
      meta: { dataType: "arr", isForeigns: true },
    },
  ],
  ordersWares: [
    { accessorKey: "orderId", header: "Order Id", meta: { dataType: "int" } },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      meta: { dataType: "num" },
    },
    { accessorKey: "amount", header: "Amount", meta: { dataType: "num" } },
    { accessorKey: "returned", header: "Returned", meta: { dataType: "num" } },
  ],
  waresTickets: [
    { accessorKey: "ticketId", header: "Ticket Id", meta: { dataType: "int" } },
    { accessorKey: "amount", header: "Amount", meta: { dataType: "num" } },
    { accessorKey: "returned", header: "Returned", meta: { dataType: "num" } },
  ],
}
