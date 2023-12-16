// pages/payments/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PaymentsTable } from "src/sections/payments/payments-table"; // Import the new PaymentsTable component
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const PaymentsIndexPage = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const auth = useAuthContext();
  const token = auth.user.accessToken;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (isMounted && response.data.success) {
          setPayments(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch payments. Please try again later.");
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
        <title>Payments | Your App Name</title>
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
            <Typography variant="h4">Manage Payments</Typography>
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
