// EditParkingTypeForm.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditParkingTypeForm = ({ isOpen, onClose, onUpdate, parkingType }) => {
  // Use the same state for form data in both components
  const [formData, setFormData] = useState({
    parkingTypeId: "",
    parkingTypeName: "",
    parkingTypeGroup: "",
    parkingTypeFee: "",
    description: "",
  });

  useEffect(() => {
    setFormData(parkingType || {});
  }, [parkingType]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Parking Type</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Parking Type Name"
          type="text"
          fullWidth
          value={formData.parkingTypeName || ""}
          onChange={(e) => handleChange("parkingTypeName", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Parking Type Group"
          type="text"
          fullWidth
          value={formData.parkingTypeGroup || ""}
          onChange={(e) => handleChange("parkingTypeGroup", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Parking Type Fee"
          type="number"
          fullWidth
          value={formData.parkingTypeFee || ""}
          onChange={(e) => handleChange("parkingTypeFee", e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onUpdate(formData)} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditParkingTypeForm;
