// pages/payments/index.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PaymentsTable } from "src/sections/payments/payments-table";
import { PaymentsSearch } from "src/sections/payments/payments-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const PaymentsIndexPage = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const auth = useAuthContext();
  const token = auth.user.accessToken;

  useEffect(() => {
    fetchData();
  }, [searchTerm]); // Include searchTerm in the dependency array

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter payments based on the search term
        const filteredPayments = response.data.data.filter((payment) =>
          payment.registrationId.toString().includes(searchTerm)
        );

        setPayments(filteredPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments. Please try again later.");
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleSearch = (term) => {
    setPage(0); // Reset page when searching
    setSearchTerm(term);
  };

  return (
    <>
      <Head>
        <title>Payments | Smart-Parking</title>
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
            <Typography variant="h4">Payments</Typography>
            <PaymentsSearch onSearch={handleSearch} />
            <PaymentsTable
              count={payments.length}
              items={applyPagination(payments, page, rowsPerPage)}
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

PaymentsIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PaymentsIndexPage;
