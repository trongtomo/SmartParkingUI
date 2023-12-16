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

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/cards`;
const CardsIndexPage = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActive, setShowActive] = useState(false);
  const [showBroken, setShowBroken] = useState(false);
  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (isMounted && response.data.code === 200) {
          const formattedData = response.data.data.cards.map((card) => ({
            cardId: card.cardId,
            startDate: card.startDate ? moment(card.startDate).format("YYYY-MM-DD ") : "",
            expiredDate: card.expiredDate ? moment(card.expiredDate).format("YYYY-MM-DD ") : "",
            status: card.status,
            bikeId: card.bikeId,
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

    if (showBroken) {
      filteredCards = filteredCards.filter((card) => card.status === "broken");
    }

    return filteredCards;
  };
  const handleShowActiveChange = (event) => {
    setShowActive(event.target.checked);
    setPage(0); // Reset page when changing filters
  };

  const handleShowBrokenChange = (event) => {
    setShowBroken(event.target.checked);
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
                  label="Show Active Cards"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showBroken}
                      onChange={handleShowBrokenChange}
                      color="primary"
                    />
                  }
                  label="Show Broken Cards"
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
