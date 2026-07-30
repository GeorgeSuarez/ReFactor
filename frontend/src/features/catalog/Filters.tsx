import { Box, Button, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { Search } from "@mui/icons-material";
import RadioButtonGroup from "../../app/shared/components/RaidoButtonGroup";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price: High to low" },
  { value: "price", label: "Price: Low to high" },
];

type Props = {
  filtersData: { brands: string[]; types: string[] };
};

export default function Filters({ filtersData: data }: Props) {
  const { orderBy, types, brands } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "primary.main", mb: 1, display: "block" }}
        >
          // sort
        </Typography>
        <RadioButtonGroup
          options={sortOptions}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
          selectedValue={orderBy}
        />
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "primary.main", mb: 1, display: "block" }}
        >
          // brands
        </Typography>
        <CheckboxButtons
          items={data.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "primary.main", mb: 1, display: "block" }}
        >
          // types
        </Typography>
        <CheckboxButtons
          items={data.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>
      <Button
        onClick={() => dispatch(resetParams())}
        variant="outlined"
        size="small"
        sx={{
          fontFamily: '"DM Mono", monospace',
          fontSize: "0.75rem",
        }}
      >
        Reset filters
      </Button>
    </Box>
  );
}
