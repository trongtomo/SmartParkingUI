// RegistrationsSearch.js

import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Set your API URL

export const RegistrationsSearch = ({ onSearch }) => {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Search by Plate Number"
        // value={searchTerm}
        onChange={onSearch}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
        endAdornment={
          <InputAdornment position="end">
            {/* <button onClick={handleSearch}>Search</button> */}
          </InputAdornment>
        }
      />
    </Card>
  );
};
