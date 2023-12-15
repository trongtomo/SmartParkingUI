import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Button, Unstable_Grid2 as Grid } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { toast } from "react-toastify";
import Link from "next/link";

const apiUrl = "https://smart-parking-server-dev.azurewebsites.net";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNVQwMTowODo1MS4zMjZaIn0sImlhdCI6MTcwMjYwMjUzMX0.5QLM-Kh-HKgxR79v0cYRhntZC0DGYFlZt9UspIDWk9I";

const CreateFeeForm = ({ open, handleClose, handleCreate }) => {
  const [feeName, setFeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateClick = () => {
    // Validate the form fields, perform additional checks if needed
    if (feeName && amount && description) {
      handleCreate({ feeName, amount, description });
      handleClose();
    } else {
      // Display an error or handle invalid form data
      console.error("Invalid form data");
      toast.error("Invalid form data. Please fill in all the fields.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Fee</DialogTitle>
      <DialogContent>
        <DialogContentText>Fill in the details for the new fee:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="feeName"
          label="Fee Name"
          type="text"
          fullWidth
          value={feeName}
          onChange={(e) => setFeeName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="amount"
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateClick} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const handleCreateFee = async (formData) => {
  try {
    // Make a POST request to create a new fee with the provided data
    const response = await axios.post(`${apiUrl}/api/admin/fees`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      setFeesList((prevFees) => [...prevFees, response.data.data.fee]);
      toast.success("Fee created successfully!");
    } else {
      console.error("Failed to create fee:", response.data.message);
    }
  } catch (error) {
    toast.error("Error creating fee. Please try again.", { autoClose: 3000 });
    console.error("Error creating fee:");
  }
};
const FeesIndexPage = ({ fees }) => {
  const [feesList, setFeesList] = useState(fees);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Fee Management | Your App Name</title>
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
            <Typography variant="h4">Fee Management</Typography>
            <div style={{ textAlign: "left" }}>
              <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
                Create New Fee
              </Button>
            </div>
            {/* Create Fee Form */}
            <CreateFeeForm
              open={isFormOpen}
              handleClose={() => setIsFormOpen(false)}
              handleCreate={handleCreateFee}
            />
            <Grid container spacing={3}>
              {feesList.map((fee) => (
                <Grid item key={fee.feeId} xs={12} md={6} lg={4}>
                  <Box
                    sx={{
                      backgroundColor: "#f0f0f0",
                      borderRadius: 4,
                      padding: 3,
                      minHeight: "250px",
                      margin: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography variant="h6" gutterBottom>
                        {fee.feeName}
                      </Typography>
                      <Typography variant="body1">{`Amount: ${fee.amount}`}</Typography>
                      <Typography variant="body1">{`Description: ${fee.description}`}</Typography>
                      {/* <Typography variant="body1">{`Created At: ${fee.createdAt}`}</Typography> */}
                      <Typography variant="body1">{`Updated At: ${fee.updatedAt}`}</Typography>
                    </div>
                    <Link href={`/fees/${fee.feeId}`}>
                      <Button variant="outlined" color="primary">
                        View Details
                      </Button>
                    </Link>
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

FeesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/admin/fees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.fees) {
      const fees = response.data.data.fees;
      return {
        props: { fees },
      };
    } else {
      return {
        props: { fees: [] },
      };
    }
  } catch (error) {
    console.error("Error fetching fees data:", error);
    return {
      props: { fees: [] },
    };
  }
};
export default FeesIndexPage;
