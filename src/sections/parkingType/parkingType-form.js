// EditParkingTypeForm.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditParkingTypeForm = ({ isOpen, onClose, onUpdate, parkingType, onInputChange }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Parking Type</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Parking Type Name"
          type="text"
          fullWidth
          value={parkingType.parkingTypeName || ""}
          onChange={(e) => onInputChange("parkingTypeName", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Parking Type Group"
          type="text"
          fullWidth
          value={parkingType.parkingTypeGroup || ""}
          onChange={(e) => onInputChange("parkingTypeGroup", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Parking Type Fee"
          type="number"
          fullWidth
          value={parkingType.parkingTypeFee || ""}
          onChange={(e) => onInputChange("parkingTypeFee", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={parkingType.description || ""}
          onChange={(e) => onInputChange("description", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onUpdate(parkingType)} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditParkingTypeForm;
