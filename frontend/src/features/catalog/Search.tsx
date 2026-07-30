import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { debounce, TextField } from "@mui/material";
import { setSearchTerm } from "./catalogSlice";

export default function Search() {
  const { searchTerm } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  const [term, setTerm] = useState(searchTerm);

  const debouncedSearch = useMemo(
    () =>
      debounce((event) => {
        dispatch(setSearchTerm(event.target.value));
      }, 500),
    [dispatch],
  );

  return (
    <TextField
      label="Search products"
      variant="outlined"
      type="search"
      value={term}
      onChange={(e) => {
        setTerm(e.target.value);
        debouncedSearch(e);
      }}
    />
  );
}
