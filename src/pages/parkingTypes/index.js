"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ParkingTypesIndexPage = () => {
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  const [parkingTypesList, setParkingTypesList] = useState([]);
  const [formData, setFormData] = useState({
    parkingTypeName: "",
    description: "",
  });
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

  const handleDelete = async (parkingType) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/admin/parkingTypes/delete/${parkingType.parkingTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setParkingTypesList((prevParkingTypes) =>
          prevParkingTypes.filter((item) => item.parkingTypeId !== parkingType.parkingTypeId)
        );
        toast.success("Delete parking Type success!");
      } else {
        toast.error("Failed to delete parking type:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting parking type:", error);
      if (error.response && error.response.status === 500) {
        // Server error, display the server error message if available
        const serverErrorMessage =
          error.response.data && error.response.data.message
            ? error.response.data.message
            : "Parking already associated with cards or sessions";

        toast.error(`Failed to delete parking type: ${serverErrorMessage}`);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Parking Type | Smart Parking</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Parking Types</Typography>
            <div style={{ textAlign: "left" }}>
              <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
                Create New Parking Type
              </Button>
            </div>
            <Dialog
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Parking Type Details</DialogTitle>
              <DialogContent>
                <DialogContentText>Fill in the details for the new parking type:</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id=" parkingTypeName"
                  label="Name"
                  type="text"
                  fullWidth
                  value={formData.parkingTypeName}
                  onChange={(e) => handleInputChange("parkingTypeName", e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="description"
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
                        Description: {parkingType.description}
                      </Typography>
                    </div>
                    <Button
                      variant="outlined"
                      color="secondary" // Change color to red or any color that indicates delete
                      onClick={() => handleDelete(parkingType)}
                    >
                      Delete
                    </Button>
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
