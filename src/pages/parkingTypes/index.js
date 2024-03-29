// ParkingTypesIndexPage.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import EditParkingTypeForm from "src/sections/parkingType/parkingType-form";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ParkingTypesIndexPage = () => {
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const [parkingTypesList, setParkingTypesList] = useState([]);
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState({
    parkingTypeId: "",
    parkingTypeName: "",
    parkingTypeGroup: "",
    parkingTypeFee: "",
    description: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchParkingTypes();
  }, []);

  const fetchParkingTypes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/parkingTypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setParkingTypesList(response.data.data.parkingTypes);
      } else {
        toast.error("Failed to fetch parking types:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching parking types data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/parkingTypes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setParkingTypesList((prevParkingTypes) => [
          ...prevParkingTypes,
          response.data.data.parkingType,
        ]);
        setIsFormOpen(false);
        toast.success("Create new parking Type success!");
      } else {
        toast.error("Failed to create parking type:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating parking type:", error);
      toast.error("Failed to create parking type", error);
    }
  };

  const handleEditClick = (parkingType) => {
    setFormData({ ...parkingType });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/parkingTypes/${formData.parkingTypeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setParkingTypesList((prevParkingTypes) =>
          prevParkingTypes.map((type) =>
            type.parkingTypeId === formData.parkingTypeId ? formData : type
          )
        );
        toast.success("Parking Type Updated!");
        fetchParkingTypes();
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update parking type:", response.data.message);
        toast.error("Failed to update parking type");
      }
    } catch (error) {
      console.error("Error updating parking type:", error);
      toast.error("Error updating parking type");
    }
  };
  const filterParkingTypes = () => {
    let filteredParkingTypes = parkingTypesList;

    if (!showActive && !showInactive) {
      return []; // If both are unchecked, show no parking types
    }

    if (!showActive) {
      filteredParkingTypes = filteredParkingTypes.filter(
        (type) => type.parkingTypeStatus !== "active"
      );
    }

    if (!showInactive) {
      filteredParkingTypes = filteredParkingTypes.filter(
        (type) => type.parkingTypeStatus !== "inactive"
      );
    }

    return filteredParkingTypes;
  };
  const filteredParkingTypes = filterParkingTypes();
  const handleShowActiveChange = (event) => {
    setShowActive(event.target.checked);
  };

  const handleShowInactiveChange = (event) => {
    setShowInactive(event.target.checked);
  };
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Parking Types</Typography>
            <Card style={{ textAlign: "left", padding: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsFormOpen(true)}
                sx={{ marginTop: 2 }}
              >
                Create New Parking Type
              </Button>
              {isFormOpen && (
                <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)}>
                  <DialogTitle>Create New Parking Type</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      label="Parking Type Name"
                      type="text"
                      fullWidth
                      value={formData.parkingTypeName}
                      onChange={(e) => handleInputChange("parkingTypeName", e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Parking Type Group"
                      type="text"
                      fullWidth
                      value={formData.parkingTypeGroup}
                      onChange={(e) => handleInputChange("parkingTypeGroup", e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Parking Type Fee"
                      type="number"
                      fullWidth
                      value={formData.parkingTypeFee}
                      onChange={(e) => handleInputChange("parkingTypeFee", e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Description"
                      type="text"
                      fullWidth
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsFormOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleCreate} color="primary">
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </Card>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showActive}
                    onChange={handleShowActiveChange}
                    color="primary"
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showInactive}
                    onChange={handleShowInactiveChange}
                    color="primary"
                  />
                }
                label="Inactive"
              />
            </Box>
            <EditParkingTypeForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onUpdate={handleUpdate}
              parkingType={formData}
              onInputChange={handleInputChange}
            />

            <Grid container spacing={3}>
              {filteredParkingTypes.map((parkingType) => (
                <Grid item key={parkingType.parkingTypeId} xs={12} md={6} lg={4}>
                  <Box
                    sx={{
                      padding: 3,
                      minHeight: "150px",
                      margin: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography variant="h6" gutterBottom>
                        {parkingType.parkingTypeName}
                      </Typography>
                      <Typography variant="body1">
                        <span>Status:</span>{" "}
                        <span
                          style={{
                            color: parkingType.parkingTypeStatus === "active" ? "blue" : "red",
                          }}
                        >
                          {parkingType.parkingTypeStatus}
                        </span>
                      </Typography>
                      <Typography variant="body1">Group: {parkingType.parkingTypeGroup}</Typography>
                      <Typography variant="body1">Fee: {parkingType.parkingTypeFee} VND</Typography>
                      <Typography variant="body1">
                        Description: {parkingType.description}
                      </Typography>
                    </div>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditClick(parkingType)}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ParkingTypesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ParkingTypesIndexPage;
