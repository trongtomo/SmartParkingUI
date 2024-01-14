// pages/bikes/[bikeId].js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Container, Stack, Typography, Button, Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const BikeDetailsPage = () => {
  const [bike, setBike] = useState(null);
  const [isActivateButtonDisabled, setActivateButtonDisabled] = useState(false);
  const [isDeactivateButtonDisabled, setDeactivateButtonDisabled] = useState(false);

  const router = useRouter();
  const auth = useAuthContext();
  const token = localStorage.accessToken;
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
        const fetchedBike = response.data.data.bike;
        setBike(fetchedBike);

        // Set button states based on bike status
        setActivateButtonDisabled(fetchedBike.bikeStatus === "active");
        setDeactivateButtonDisabled(fetchedBike.bikeStatus !== "active");
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
  const handleActivate = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/bike/active/${bikeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bike activated successfully.");
      fetchBikeDetails(); // Refresh bike details after activation
    } catch (error) {
      console.error("Error activating bike:", error);
      toast.error("Failed to activate bike. Please try again later.");
    }
  };
  const handleDeactivate = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/bike/deactive/${bikeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bike deactivated successfully.");
      fetchBikeDetails(); // Refresh bike details after deactivation
    } catch (error) {
      console.error("Error deactivating bike:", error);
      toast.error("Failed to deactivate bike. Please try again later.");
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
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button onClick={() => router.back()} variant="contained">
                Back
              </Button>
              <Typography variant="h4">{`Bike Details #${bike.bikeId}`}</Typography>
              {/* Activate and Deactivate buttons */}
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleActivate}
                  disabled={isActivateButtonDisabled}
                >
                  Activate
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeactivate}
                  disabled={isDeactivateButtonDisabled}
                >
                  Deactivate
                </Button>
              </Stack>
            </Stack>

            <Card>
              <CardContent>
                <Typography variant="h6">Model: {bike.model}</Typography>
                <Typography variant="h6">Registration Number: {bike.registrationNumber}</Typography>
                <Typography variant="h6">Plate Number: {bike.plateNumber}</Typography>
                <Typography variant="h6">Manufacture: {bike.manufacturer}</Typography>
                <Typography variant="h6">Status: {bike.bikeStatus}</Typography>
                <Typography variant="h6">
                  Created At: {moment(bike.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Typography variant="h6">
                  Updated At: {moment(bike.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Typography variant="h6">
                  Registration Id:
                  <Button href={`/registrations/${bike.registrationId}`}>
                    {bike.registrationId}
                  </Button>
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

BikeDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BikeDetailsPage;
