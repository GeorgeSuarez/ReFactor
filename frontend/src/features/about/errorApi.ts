import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const errorApi = createApi({
  reducerPath: "errorApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    get400Error: builder.query<void, void>({
      query: () => ({ url: "buggy/bad-request" }),
    }),
    get401Error: builder.query<void, void>({
      query: () => ({ url: "buggy/bad-request" }),
    }),
    get404Error: builder.query<void, void>({
      query: () => ({ url: "buggy/bad-request" }),
    }),
    get500Error: builder.query<void, void>({
      query: () => ({ url: "buggy/bad-request" }),
    }),
    getValidationError: builder.query<void, void>({
      query: () => ({ url: "buggy/bad-request" }),
    }),
  }),
});

export const {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery,
} = errorApi;
