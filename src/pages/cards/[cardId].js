// pages/cards/[cardId].js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CardDetailsPage = () => {
  const [cardLogs, setCardLogs] = useState([]); // Initialize as an empty array
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const router = useRouter();
  const cardId = router.query.cardId;

  useEffect(() => {
    if (cardId) {
      fetchCardLogs(cardId);
    }
  }, [cardId]);

  const fetchCardLogs = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/cards/history/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        setCardLogs(response.data.data);
      } else {
        toast.error("Failed to fetch card logs. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching card logs:", error);
      toast.error("Failed to fetch card logs. Please try again later.");
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => router.back()} variant="contained">
                Back
              </Button>
              <Typography variant="h4">{`Card Details #${cardId || ""}`}</Typography>
            </Stack>
            <Typography variant="h5">Card Logs</Typography>
            {cardLogs.map((log) => (
              <Box key={log.cardHistoryId} border={1} p={2} mb={2}>
                <Typography variant="body1">{`Timestamp: ${
                  moment(log.createdAt).format("YYYY-MM-DD HH:mm:ss") || "N/A"
                }`}</Typography>
                <Typography variant="body1">{`Event: ${log.event || "N/A"}`}</Typography>
                <Typography variant="body1">{`Approved By: ${log.approvedBy || "N/A"}`}</Typography>
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
