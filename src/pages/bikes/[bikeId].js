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

  const [availableCards, setAvailableCards] = useState([]);
  const [assignedCards, setAssignedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");

  const router = useRouter();
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const bikeId = router.query.bikeId;

  const fetchAvailableCards = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/active-cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Assuming the response data is an object with an "activeCards" property
        setAvailableCards(response.data.data.activeCards || []);
      } else {
        toast.error("Failed to fetch available cards. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching available cards:", error);
      toast.error("Failed to fetch available cards. Please try again later.");
    }
  };
  const fetchAssignedCards = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/admin/cards/getAllCardsByBikeId?bikeId=${bikeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAssignedCards(response.data.data);
      } else {
        toast.error("Failed to fetch assigned cards. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching assigned cards:", error);
      toast.error("Failed to fetch assigned cards. Please try again later.");
    }
  };

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

        // Fetch available and assigned cards for the bike
        fetchAvailableCards();
        fetchAssignedCards();
      } else {
        toast.error("Failed to fetch bike details. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching bike details:", error);
      toast.error("Failed to fetch bike details. Please try again later.");
    }
  };

  useEffect(() => {
    // Fetch bike details when the component mounts
    fetchBikeDetails();
  }, []);

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

  const handleAssignCard = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/admin/cards/assign`,
        {
          plateNumber: bike.plateNumber,
          cardId: selectedCardId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Card assigned to bike successfully.");
      fetchAvailableCards(); // Refresh the list of available cards after assignment
      fetchAssignedCards(); // Refresh the list of assigned cards after assignment
    } catch (error) {
      console.error("Error assigning card:", error);
      toast.error("Failed to assign card. Please try again later.");
    }
  };

  const handleCardChange = (event) => {
    setSelectedCardId(event.target.value);
  };

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
              <Typography variant="h4">{`Bike Details #${bike?.bikeId}`}</Typography>
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
                <Typography variant="h6">Model: {bike?.model}</Typography>
                <Typography variant="h6">
                  Registration Number: {bike?.registrationNumber}
                </Typography>
                <Typography variant="h6">Plate Number: {bike?.plateNumber}</Typography>
                <Typography variant="h6">Manufacture: {bike?.manufacturer}</Typography>
                <Typography variant="h6">Status: {bike?.bikeStatus}</Typography>
                <Typography variant="h6">
                  Created At: {moment(bike?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Typography variant="h6">
                  Updated At: {moment(bike?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
                <Typography variant="h6">
                  Registration Id:{" "}
                  <Button href={`/registrations/${bike?.registrationId}`}>
                    {bike?.registrationId}
                  </Button>
                </Typography>
              </CardContent>
            </Card>

            {/* Display Assigned Cards */}
            {assignedCards.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Assigned Cards:</Typography>
                  <ul>
                    {assignedCards.map((card) => (
                      <li key={card.cardId}>{card.cardId}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Card Assignment Section */}
            <Card>
              <CardContent>
                <Typography variant="h6">Assign New Cards:</Typography>
                <select value={selectedCardId} onChange={handleCardChange}>
                  <option value="" disabled>
                    Select a card
                  </option>
                  {availableCards.map((card) => (
                    <option key={card.cardId} value={card.cardId}>
                      {card.cardId}
                    </option>
                  ))}
                </select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAssignCard}
                  disabled={!selectedCardId}
                >
                  Assign Card
                </Button>
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
