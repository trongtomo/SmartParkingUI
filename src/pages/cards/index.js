// pages/cards/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CardsTable } from "src/sections/cards/cards-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const CardsIndexPage = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActive, setShowActive] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (isMounted && response.data.code === 200) {
          const formattedData = response.data.data.cards.map((card) => ({
            cardId: card.cardId,
            startDate: card.startDate ? moment(card.startDate).format("YYYY-MM-DD ") : "N/A",
            expiredDate: card.expiredDate ? moment(card.expiredDate).format("YYYY-MM-DD ") : "N/A",
            status: card.status,
            plateNumber: card.Bike ? card.Bike.plateNumber : "N/A",
            parkingTypeId: card.parkingTypeId,
          }));
          setCards(formattedData);
        }
      } catch (error) {
        toast.error("Failed to fetch cards. Please try again later.");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };
  const filterCards = () => {
    let filteredCards = cards;

    if (showActive) {
      filteredCards = filteredCards.filter((card) => card.status === "active");
    }

    if (showAssigned) {
      filteredCards = filteredCards.filter((card) => card.status === "assigned");
    }
    if (showExpired) {
      filteredCards = filteredCards.filter(
        (card) => card.status !== "active" && card.status !== "assigned"
      );
    }
    return filteredCards;
  };
  const handleShowActiveChange = (event) => {
    setShowActive(event.target.checked);
    setPage(0); // Reset page when changing filters
  };
  const handleShowExpiredChange = (event) => {
    setShowExpired(event.target.checked);
    setPage(0); // Reset page when changing filters
  };
  const handleShowAssignedChange = (event) => {
    setShowAssigned(event.target.checked);
    setPage(0); // Reset page when changing filters
  };
  return (
    <>
      <Head>
        <title>Cards | Your App Name</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Manage Cards</Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showActive}
                      onChange={handleShowActiveChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showAssigned}
                      onChange={handleShowAssignedChange}
                      color="primary"
                    />
                  }
                  label="Assigned"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showExpired}
                      onChange={handleShowExpiredChange}
                      color="primary"
                    />
                  }
                  label="Expired"
                />
              </Box>
            </Stack>
            <CardsTable
              count={filterCards().length}
              items={applyPagination(filterCards(), page, rowsPerPage)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CardsIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CardsIndexPage;
