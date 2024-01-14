"use-client";
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

      if (response.data.success && response.data.data && response.data.data.parkingTypes) {
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
    setFormData((prevData) => ({
      ...prevData,
      parkingTypeId: parkingType.parkingTypeId,
      parkingTypeName: parkingType.parkingTypeName,
      parkingTypeGroup: parkingType.parkingTypeGroup,
      parkingTypeFee: parkingType.parkingTypeFee,
      description: parkingType.description,
    }));
    setIsEditModalOpen(true);
    console.log("Form data after edit click:", formData);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/parkingTypes/${formData.parkingTypeId}`,
        {
          parkingTypeId: formData.parkingTypeId,
          parkingTypeName: formData.parkingTypeName,
          parkingTypeGroup: formData.parkingTypeGroup,
          parkingTypeFee: formData.parkingTypeFee,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setParkingTypesList((prevParkingTypes) =>
          prevParkingTypes.map((type) =>
            type.parkingTypeId === formData.parkingTypeId ? response.data.data.parkingType : type
          )
        );
        console.log("API response", response);
        toast.success("Parking Type Updated!");
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
                onClick={() => {
                  setIsFormOpen(true);
                }}
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
            <EditParkingTypeForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onUpdate={handleUpdate}
              parkingType={formData}
            />

            <Grid container spacing={3}>
              {parkingTypesList.map((parkingType) => (
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
                        Status: {parkingType.parkingTypeStatus}
                      </Typography>
                      <Typography variant="body1">Group: {parkingType.parkingTypeGroup}</Typography>
                      <Typography variant="body1">Fee: {parkingType.parkingTypeFee}</Typography>
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
