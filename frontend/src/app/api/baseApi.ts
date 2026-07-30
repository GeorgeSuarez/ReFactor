import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  type BaseQueryApi,
  type FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { getRouter } from "../lib/router";

const customBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
});

type ErrorData = { title?: string; errors?: Record<string, string[]> };

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  api.dispatch(startLoading());
  if (import.meta.env.DEV) await sleep();
  const result = await customBaseQuery(args, api, extraOptions);
  api.dispatch(stopLoading());

  if (result.error) {
    console.log(result.error);

    const data = result.error.data as ErrorData | undefined;

    if (!data || typeof data !== "object") return result;

    const isParsingError =
      (result.error as FetchBaseQueryError).status === "PARSING_ERROR";
    const originalStatus = isParsingError
      ? (result.error as FetchBaseQueryError & { originalStatus?: number }).originalStatus ?? 400
      : (result.error as FetchBaseQueryError).status;

    switch (originalStatus) {
      case 400:
        if (typeof data === "string") toast.error(data);
        else if (data.errors) {
          throw new Error(Object.values(data.errors).flat().join(", "));
        } else if (data.title) toast.error(data.title);
        break;
      case 401:
        if (data.title) toast.error(data.title);
        break;
      case 403:
        toast.error("403 Forbidden");
        break;
      case 404:
        if (data.title) getRouter()?.navigate("/not-found");
        break;
      case 500:
        getRouter()?.navigate("/server-error", {
          state: { error: data },
        });
        break;
      default:
        break;
    }
  }

  return result;
};
