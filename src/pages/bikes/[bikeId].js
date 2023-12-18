// pages/bikes/[bikeId].js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const BikeDetailsPage = () => {
  const [bike, setBike] = useState(null);
  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  const bikeId = router.query.bikeId;
  useEffect(() => {
    // Fetch bike details when the component mounts
    fetchBikeDetails();
  }, []);

  const fetchBikeDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/bikes/${bikeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setBike(response.data.data.bike);
      } else {
        toast.error("Failed to fetch bike details. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching bike details:", error);
      toast.error("Failed to fetch bike details. Please try again later.");
    }
  };

  if (!bike) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Bike Details</Typography>
            </Stack>

            <Box>
              <Typography variant="h6">Model: {bike.model}</Typography>
              <Typography variant="h6">Registration Number: {bike.registrationNumber}</Typography>
              <Typography variant="h6">Plate Number: {bike.plateNumber}</Typography>
              <Typography variant="h6">Manufacture: {bike.manufacture}</Typography>
              <Typography variant="h6">Status: {bike.status}</Typography>
              <Typography variant="h6">
                Created At: {moment(bike.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
              <Typography variant="h6">
                Updated At: {moment(bike.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
              <Typography variant="h6">User ID: {bike.userId}</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

BikeDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BikeDetailsPage;
