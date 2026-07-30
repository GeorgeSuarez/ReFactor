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

type ErrorResponse = string | { title: string } | { errors: string[] };

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

    const responseData = result.error.data;

    if (!responseData || typeof responseData !== "object") return result;

    const originalStatus =
      result.error.status === "PARSING_ERROR" && result.error.originalStatus
        ? result.error.originalStatus
        : result.error.status;

    switch (originalStatus) {
      case 400:
        if (typeof responseData === "string") toast.error(responseData);
        else if ("errors" in responseData) {
          throw new Error(Object.values(responseData.errors).flat().join(", "));
        } else toast.error(responseData.title);
        break;
      case 401:
        if ("title" in responseData) toast.error(responseData.title);
        break;
      case 403:
        toast.error("403 Forbidden");
        break;
      case 404:
        if ("title" in responseData) getRouter()?.navigate("/not-found");
        break;
      case 500:
        getRouter()?.navigate("/server-error", {
          state: { error: responseData },
        });
        break;
      default:
        break;
    }
  }

  return result;
};
