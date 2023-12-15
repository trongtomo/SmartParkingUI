// pages/cards/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CardsTable } from "src/sections/cards/cards-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = `https://smart-parking-server-dev.azurewebsites.net/api/admin/cards`;
const CardsIndexPage = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNVQwMTowODo1MS4zMjZaIn0sImlhdCI6MTcwMjYwMjUzMX0.5QLM-Kh-HKgxR79v0cYRhntZC0DGYFlZt9UspIDWk9I";

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
            startDate: card.startDate ? moment(card.startDate).format("YYYY-MM-DD HH:mm:ss") : "",
            expiredDate: card.expiredDate
              ? moment(card.expiredDate).format("YYYY-MM-DD HH:mm:ss")
              : "",
            currentStatus: card.currentStatus,
            bikeId: card.bikeId,
            parkingTypeId: card.parkingTypeId,
            createdAt: moment(card.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(card.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
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
            </Stack>
            <CardsTable
              count={cards.length}
              items={applyPagination(cards, page, rowsPerPage)}
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
