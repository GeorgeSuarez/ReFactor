import type { createBrowserRouter } from "react-router-dom";

let _router: ReturnType<typeof createBrowserRouter> | null = null;

export const getRouter = () => _router;
export const setRouter = (r: typeof _router) => {
  _router = r;
};
