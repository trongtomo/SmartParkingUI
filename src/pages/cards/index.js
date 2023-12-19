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
  const token = auth.user.accessToken;

  useEffect(() => {
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
            startDate: moment(card.startDate).format("YYYY-MM-DD ") || "N/A",
            expiredDate: moment(card.expiredDate).format("YYYY-MM-DD ") || "N/A",
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
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };  

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };
  const handleDeactivate = async (card) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/cards/deactive/${card.cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Card with ID ${card.cardId} deactivated successfully`);
        // Refresh the cards after deactivation
        fetchData();
      } else {
        console.error(`Failed to deactivate card with ID ${card.cardId}`);
      }
    } catch (error) {
      console.error("Error deactivating card:", error);
    }
  };
  const handleActivate = async (card) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/cards/active/${card.cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Card with ID ${card.cardId} activated successfully`);
        // Refresh the cards after activation
        fetchData();
      } else {
        console.error(`Failed to activate card with ID ${card.cardId}`);
      }
    } catch (error) {
      console.error("Error activating card:", error);
    }
  };
  const handleRevoke = async (plateNumber) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/cards/revoke?plateNumber=${plateNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Card with Plate Number ${plateNumber} revoked successfully`);
        // Refresh the cards after revocation
        fetchData();
      } else {
        console.error(`Failed to revoke card with Plate Number ${plateNumber}`);
      }
    } catch (error) {
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
              onDeactivate={handleDeactivate}
              onActivate={handleActivate}
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
