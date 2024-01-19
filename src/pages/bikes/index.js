// pages/bikes/index.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BikesTable } from "src/sections/bikes/bikes-table";
import { BikesSearch } from "src/sections/bikes/bikes-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const BikesIndexPage = () => {
  const [originalBikes, setOriginalBikes] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActive, setShowActive] = useState(true);
  const [showDeactive, setShowDeactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const auth = useAuthContext();
  const token = localStorage.accessToken;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/bikes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const bikesData = response.data.data.bikes;
        setOriginalBikes(bikesData);
        filterAndSetBikes(bikesData, searchTerm, showActive, showDeactive);
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

  const handleShowActiveChange = (event) => {
    setShowActive(event.target.checked);
    setPage(0);
    filterAndSetBikes(originalBikes, searchTerm, event.target.checked, showDeactive);
  };

  const handleShowDeactiveChange = (event) => {
    setShowDeactive(event.target.checked);
    setPage(0);
    filterAndSetBikes(originalBikes, searchTerm, showActive, event.target.checked);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(0);
    filterAndSetBikes(originalBikes, term, showActive, showDeactive);
  };

  const filterAndSetBikes = (data, term, active, deactive) => {
    const filteredBikes = data
      .filter((bike) => bike.plateNumber.toLowerCase().includes(term.toLowerCase()))
      .filter(
        (bike) =>
          (active && bike.bikeStatus === "active") || (deactive && bike.bikeStatus === "inactive")
      );

    setBikes(filteredBikes);
  };

  return (
    <>
      <Head>
        <title>Bikes | Smart-Parking</title>
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
            </Box>

            <BikesTable
              count={bikes.length}
              items={applyPagination(bikes, page, rowsPerPage)}
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
