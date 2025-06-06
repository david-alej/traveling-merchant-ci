export const providesList = (resultsWithIds, tagType) =>
  resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }]

export const createEndpointOptions = (tagType) => ({
  endpoints: (build) => ({
    [`get${tagType}`]: build.query({
      query: (id) => ({ url: `${tagType.toLowerCase()}s/${id}` }),
      providesTags: (result, error, id) => [{ type: tagType, id }],
    }),
    [`get${tagType}s`]: build.query({
      query: (body) => ({
        url: `${tagType.toLowerCase()}s/search`,
        method: "POST",
        body,
      }),
      providesTags: (result) => providesList(result, tagType),
    }),
    [`create${tagType}`]: build.mutation({
      query: (body) => ({
        url: `${tagType.toLowerCase()}s`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: tagType, id: "LIST" }],
    }),
    [`update${tagType}`]: build.mutation({
      query: ({ id, ...body }) => ({
        url: `${tagType.toLowerCase()}s/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: tagType, id }],
    }),
    [`delete${tagType}`]: build.mutation({
      query: (id) => ({
        url: `${tagType.toLowerCase()}s/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: tagType, id }],
    }),
  }),
})
