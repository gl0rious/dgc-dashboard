import { FilterButton, FilterForm } from "react-admin";
import { Stack } from "@mui/material";

export const ListToolbar = (props: any) => {
  const { postFilters } = props;
  return (
    <Stack direction="row" justifyContent="space-between">
      <FilterForm filters={postFilters} />
      <div>
        <FilterButton filters={postFilters} disableSaveQuery />
      </div>
    </Stack>
  );
};
