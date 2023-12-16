// CardStatusFilter.js
import React from "react";
import { FormControlLabel, Checkbox } from "@mui/material";

const CardStatusFilter = ({ showOnlyAssigned, onFilterChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox checked={showOnlyAssigned} onChange={(e) => onFilterChange(e.target.checked)} />
      }
      label="Show Only Assigned"
    />
  );
};

export default CardStatusFilter;
