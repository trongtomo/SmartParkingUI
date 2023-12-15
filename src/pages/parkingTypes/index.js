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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const apiUrl = "https://smart-parking-server-dev.azurewebsites.net";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNVQwMTowODo1MS4zMjZaIn0sImlhdCI6MTcwMjYwMjUzMX0.5QLM-Kh-HKgxR79v0cYRhntZC0DGYFlZt9UspIDWk9I";

const ParkingTypesIndexPage = () => {
  const [parkingTypesList, setParkingTypesList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
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
        console.error("Failed to fetch parking types:", response.data.message);
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
      } else {
        console.error("Failed to create parking type:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating parking type:", error);
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
      } else {
        console.error("Failed to delete parking type:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting parking type:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Typography variant="h4">Parking Type Management</Typography>
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
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
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
                    {parkingType.name}
                  </Typography>
                  <Typography variant="body1">Description: {parkingType.description}</Typography>
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
  );
};

ParkingTypesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ParkingTypesIndexPage;
