// pages/bikes/index.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BikesTable } from "src/sections/bikes/bikes-table";
import { BikesSearch } from "src/sections/bikes/bikes-search"; // Import the search component
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BikesIndexPage = () => {
  const [bikes, setBikes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showActive, setShowActive] = useState(false);
  const [showDeactive, setShowDeactive] = useState(false);
  const [showTempDeactive, setShowTempDeactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user.accessToken;

  useEffect(() => {
    fetchData();
  }, [token, searchTerm]); // Include token and searchTerm in the dependency array

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/bikes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter bikes based on the search term
        const filteredBikes = response.data.data.bikes.filter((bike) =>
          bike.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply additional filters if needed (e.g., showActive, showDeactive, showTempDeactive)

        setBikes(filteredBikes);
      }
    } catch (error) {
      console.error("Error fetching bikes:", error);
      toast.error("Failed to fetch bikes. Please try again later.");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const filterBikes = () => {
    let filteredBikes = bikes;

    if (showActive) {
      filteredBikes = filteredBikes.filter((bike) => bike.status === "active");
    }

    if (showDeactive) {
      filteredBikes = filteredBikes.filter((bike) => bike.status === "deactive");
    }

    if (showTempDeactive) {
      filteredBikes = filteredBikes.filter((bike) => bike.status === "temporarily_deactive");
    }

    return filteredBikes;
  };

  const handleShowActiveChange = (event) => {
    setShowActive(event.target.checked);
    setPage(0); // Reset page when changing filters
  };

  const handleShowDeactiveChange = (event) => {
    setShowDeactive(event.target.checked);
    setPage(0); // Reset page when changing filters
  };

  const handleShowTempDeactiveChange = (event) => {
    setShowTempDeactive(event.target.checked);
    setPage(0); // Reset page when changing filters
  };

  const handleSearch = (term) => {
    setPage(0); // Reset page when searching
    setSearchTerm(term);
  };

  return (
    <>
      <Head>
        <title>Bikes | Your App Name</title>
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
              <Typography variant="h4">Manage Bikes</Typography>
            </Stack>

            <BikesSearch onSearch={handleSearch} />

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
                    checked={showDeactive}
                    onChange={handleShowDeactiveChange}
                    color="primary"
                  />
                }
                label="Deactive"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showTempDeactive}
                    onChange={handleShowTempDeactiveChange}
                    color="primary"
                  />
                }
                label="Temp. Deactive"
              />
            </Box>

            <BikesTable
              count={filterBikes().length}
              items={applyPagination(filterBikes(), page, rowsPerPage)}
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

BikesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BikesIndexPage;
