import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Card, InputAdornment, OutlinedInput, SvgIcon, Button } from "@mui/material";

export const CardsSearch = ({ onSearch }) => {
  const handleSearch = (event) => {
    // Prevent form submission
    event.preventDefault();
    // Perform search
    onSearch(event.target.elements.search.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <form onSubmit={handleSearch}>
        <OutlinedInput
          name="search"
          defaultValue=""
          fullWidth
          placeholder="Search by cardId"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <Button type="submit" variant="contained">
                Search
              </Button>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      </form>
    </Card>
  );
};
