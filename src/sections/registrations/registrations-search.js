// RegistrationsSearch.js

import { useState } from "react";
import axios from "axios";
import { Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useAuthContext } from "src/contexts/auth-context";

const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Set your API URL

export const RegistrationsSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/registrations/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { plateNumber: searchTerm },
      });

      if (response.data.success) {
        onSearch(response.data.data); // Pass the search results to the parent component
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error searching registrations:", error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Search Registration"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
            <button onClick={handleSearch}>Search</button>
          </InputAdornment>
        }
      />
    </Card>
  );
};
