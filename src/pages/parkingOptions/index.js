// pages/parking-options/index.js

import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Paper,
  Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ParkingOptions = () => {
  const [parkingOptions, setParkingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    parkingOptionKey: "",
    parkingOptionValue: "",
    notes: "",
  });
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    parkingOptionKey: "",
    parkingOptionValue: "",
    notes: "",
  });
  const [selectedParkingOption, setSelectedParkingOption] = useState(null);

  const token = localStorage.accessToken;
  const fetchParkingOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/parkingOptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParkingOptions(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading parking options:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchParkingOptions();
  }, []);

  const handleCreateClick = () => {
    setOpenCreateForm(true);
  };

  const handleCreateClose = () => {
    setOpenCreateForm(false);
    // Reset the form data after closing
    setCreateFormData({
      parkingOptionKey: "",
      parkingOptionValue: "",
      notes: "",
    });
  };

  const handleCreateSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/parkingOptions`, createFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle success, e.g., show a notification
  

      // Reload parking options after creating a new one
      fetchParkingOptions();
      handleCreateClose();
      showToast("Parking option created successfully", "success");
    } catch (error) {
      console.error("Error creating parking option:", error);
      showToast("Error creating parking option", "error");
      // Handle error, e.g., show an error message
    }
  };

  const handleInputChange = (field, value) => {
    setCreateFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleUpdateClick = (parkingOption) => {
    setSelectedParkingOption(parkingOption);
    setUpdateFormData({
      parkingOptionKey: parkingOption.parkingOptionKey,
      parkingOptionValue: parkingOption.parkingOptionValue,
      notes: parkingOption.notes || "",
    });
    setOpenUpdateForm(true);
  };

  const handleUpdateClose = () => {
    setOpenUpdateForm(false);
    // Reset the form data after closing
    setUpdateFormData({
      parkingOptionKey: "",
      parkingOptionValue: "",
      notes: "",
    });
    setSelectedParkingOption(null);
  };
  const showToast = (message, type) => {
    toast[type](message, { autoClose: 3000 });
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`${apiUrl}/api/admin/parkingOptions`, updateFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle success, e.g., show a notification


      // Reload parking options after updating
      fetchParkingOptions();
      handleUpdateClose();
      showToast("Parking option updated successfully", "success");
    } catch (error) {
      console.error("Error updating parking option:", error);
      // Handle error, e.g., show an error message
      showToast("Error updating parking option", "error");
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading parking options</p>;
  }

  return (
    <>
      <Head>
        <title>Parking Options | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" gutterBottom>
            Parking Options
          </Typography>

          <Button variant="contained" color="primary" onClick={handleCreateClick}>
            Create New Parking Option
          </Button>

          <Box mt={4}>
            {/* Render the list of parking options here */}
            {parkingOptions.map((option) => (
              <Paper key={option.parkingOptionKey} elevation={3} sx={{ padding: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="h6">{option.parkingOptionKey}</Typography>
                    <Typography>{`Value: ${option.parkingOptionValue}`}</Typography>
                    <Typography>{`Notes: ${option.notes || "N/A"}`}</Typography>
                    {/* <Typography>{`Created At: ${option.createdAt}`}</Typography>
                    <Typography>{`Updated At: ${option.updatedAt}`}</Typography> */}
                  </Grid>
                  <Grid item xs={2}>
                    <Button onClick={() => handleUpdateClick(option)} color="primary">
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>

          {/* Create Parking Option Dialog */}
          <Dialog open={openCreateForm} onClose={handleCreateClose}>
            <DialogTitle>Create New Parking Option</DialogTitle>
            <DialogContent>
              <TextField
                label="Key"
                fullWidth
                value={createFormData.parkingOptionKey}
                onChange={(e) => handleInputChange("parkingOptionKey", e.target.value)}
              />
              <TextField
                label="Value"
                fullWidth
                value={createFormData.parkingOptionValue}
                onChange={(e) => handleInputChange("parkingOptionValue", e.target.value)}
              />
              <TextField
                label="Notes"
                fullWidth
                value={createFormData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCreateClose}>Cancel</Button>
              <Button onClick={handleCreateSubmit} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>
          {/* ... (Previous JSX) */}

          {/* Update Parking Option Dialog */}
          <Dialog open={openUpdateForm} onClose={handleUpdateClose}>
            <DialogTitle>Update Parking Option</DialogTitle>
            <DialogContent>
              <TextField
                label="Key"
                fullWidth
                value={updateFormData.parkingOptionKey}
                disabled // Disable key editing
              />
              <TextField
                label="Value"
                fullWidth
                value={updateFormData.parkingOptionValue}
                onChange={(e) =>
                  setUpdateFormData((prevData) => ({
                    ...prevData,
                    parkingOptionValue: e.target.value,
                  }))
                }
              />
              <TextField
                label="Notes"
                fullWidth
                value={updateFormData.notes}
                onChange={(e) =>
                  setUpdateFormData((prevData) => ({
                    ...prevData,
                    notes: e.target.value,
                  }))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateClose}>Cancel</Button>
              <Button onClick={handleUpdateSubmit} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

ParkingOptions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ParkingOptions;
