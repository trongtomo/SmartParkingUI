// pages/cards/[cardId].js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CardDetailsPage = () => {
  const [card, setCard] = useState({});
  const [cardLogs, setCardLogs] = useState([]);
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const router = useRouter();
  const cardId = router.query.cardId;

  useEffect(() => {
    if (cardId) {
      fetchCardDetails(cardId);
    }
  }, [cardId]);

  const fetchCardDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        setCard(response.data.data.card);
      } else {
        toast.error("Failed to fetch card details. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
      toast.error("Failed to fetch card details. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>{`Card Details | Smart-Parking`}</title>
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
            <Typography variant="h4">{`Card Details #${card.cardId || ""}`}</Typography>
            <Typography variant="body1">{`Start Date: ${
              moment(card.startDate).format("YYYY-MM-DD") || "N/A"
            }`}</Typography>
            <Typography variant="body1">{`Expired Date: ${
              moment(card.expiredDate).format("YYYY-MM-DD") || "N/A"
            }`}</Typography>
            <Typography variant="body1">{`Status: ${card.status || "N/A"}`}</Typography>
            {/* Add more card details based on your API response */}

            <Typography variant="h5">Card Logs</Typography>
            {cardLogs.map((log) => (
              <Box key={log.logId} border={1} p={2} mb={2}>
                <Typography variant="body1">{`Timestamp: ${
                  moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss") || "N/A"
                }`}</Typography>
                <Typography variant="body1">{`Event: ${log.event || "N/A"}`}</Typography>
                {/* Add more log details based on your API response */}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CardDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CardDetailsPage;
