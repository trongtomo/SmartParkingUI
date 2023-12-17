// pages/fees/[feeId].js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Box, Container, Stack, Typography, Button, TextField } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import moment from "moment";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const FeeDetailsPage = () => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [feeDetails, setFeeDetails] = useState({});
  const [updatedFee, setUpdatedFee] = useState({});
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  const feeId = router.query.feeId;

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/fees/${feeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data && response.data.data.fee) {
          const fee = response.data.data.fee;
          setFeeDetails(fee);
          setUpdatedFee({ ...fee });
        } else {
          console.error("Failed to fetch fee details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching fee details:", error);
      }
    };

    fetchFeeDetails();
  }, [feeId, token]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset the updated fee to the original fee details
    setUpdatedFee({ ...feeDetails });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/fees/${feeId}`,
        {
          feeName: updatedFee.feeName,
          amount: updatedFee.amount,
          description: updatedFee.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data && response.data.data.fee) {
        setFeeDetails(response.data.data.fee);
        setIsEditMode(false);
        toast.success("Fee Updated!");
      } else {
        console.error("Failed to update fee:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error("Error updating fee");
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button onClick={() => router.back()}>Back</Button>
            <Typography variant="h4">Fee Details</Typography>
          </Stack>
          {feeDetails && (
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                padding: 3,
                minHeight: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <TextField
                  margin="dense"
                  label="Fee Name"
                  type="text"
                  fullWidth
                  value={isEditMode ? updatedFee.feeName : feeDetails.feeName}
                  onChange={(e) => setUpdatedFee({ ...updatedFee, feeName: e.target.value })}
                  disabled={!isEditMode}
                />
                <TextField
                  margin="normal"
                  label="Amount"
                  type="number"
                  fullWidth
                  value={isEditMode ? updatedFee.amount : feeDetails.amount}
                  onChange={(e) => setUpdatedFee({ ...updatedFee, amount: e.target.value })}
                  disabled={!isEditMode}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  type="text"
                  fullWidth
                  value={isEditMode ? updatedFee.description : feeDetails.description}
                  onChange={(e) => setUpdatedFee({ ...updatedFee, description: e.target.value })}
                  disabled={!isEditMode}
                />
                <Typography variant="body1">{`Created At: ${moment(
                  isEditMode ? updatedFee.createdAt : feeDetails.createdAt
                ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                <Typography variant="body1">{`Updated At: ${moment(
                  isEditMode ? updatedFee.updatedAt : feeDetails.updatedAt
                ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
              </div>
              {isEditMode ? (
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                  <Button variant="contained" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Stack>
              ) : (
                <Button variant="va" color="primary" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

FeeDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default FeeDetailsPage;
