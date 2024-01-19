// pages/cards/index.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Checkbox } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CardsTable } from "src/sections/cards/cards-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { CardsSearch } from "src/sections/cards/cards-search";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CardsIndexPage = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showActive, setShowActive] = useState(true);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = useAuthContext();
  const token = localStorage.accessToken;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.code === 200) {
        const formattedData = response.data.data.cards.map((card) => ({
          cardId: card.cardId,
          status: card.cardStatus,
          bikeId: card.bikeId,
          createdAt: moment(card.createdAt).format("YYYY-MM-DD ") || "N/A",
          updatedAt: moment(card.updatedAt).format("YYYY-MM-DD ") || "N/A",
          plateNumber: card.plateNumber,
        }));
        setCards(formattedData);
      }
    } catch (error) {
      toast.error("Failed to fetch cards. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleRevoke = async (cardId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/cards/revokeByCardId?cardId=${cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Card with Card ID ${cardId} revoked successfully`);
        // Refresh the cards after revocation
        fetchData();
      } else {
        console.error(`Failed to revoke card with Card ID ${cardId}`);
      }
    } catch (error) {
      toast.error(`Failed to Revoke card`, error);
      console.error("Error revoking card:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Cards | Smart-Parking</title>
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
            <Typography variant="h4">Manage Cards</Typography>
            <CardsSearch onSearch={setSearchTerm} />
            <Box>
              <Checkbox
                checked={showActive}
                onChange={() => setShowActive(!showActive)}
                color="primary"
              />
              Show Active
              <Checkbox
                checked={showAssigned}
                onChange={() => setShowAssigned(!showAssigned)}
                color="primary"
              />
              Show Assigned
              <Checkbox
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
                color="primary"
              />
              Show Inactive
            </Box>
            <CardsTable
              count={cards.length}
              items={applyPagination(
                cards
                  .filter((card) => {
                    if (showActive && card.status === "active") return true;
                    if (showAssigned && card.status === "assigned") return true;
                    if (showInactive && card.status !== "active" && card.status !== "assigned")
                      return true;
                    return false;
                  })
                  .filter((card) => card.cardId.toLowerCase().includes(searchTerm.toLowerCase())),
                page,
                rowsPerPage
              )}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onRevoke={handleRevoke}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CardsIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CardsIndexPage;
