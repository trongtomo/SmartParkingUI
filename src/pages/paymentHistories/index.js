// pages/paymentHistories/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PaymentHistoriesTable } from "src/sections/paymentHistories/paymentHistories-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { toast } from "react-toastify";

const apiUrl = `http://localhost:3000/api/admin/paymentHistories`;
const PaymentHistoriesIndexPage = () => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA2NjExNDE0IiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQwOTo1MzoyMy4xMTBaIn0sImlhdCI6MTcwMjExNTYwM30.FhA6rTVWvi05cYuzs_Jp8bqJajeKqEHhKyO9NvDj_A4";
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
          const paymentHistoriesData = response.data.data.paymentHistories || [];
          const formattedData = paymentHistoriesData.map((history) => ({
            paymentHistoryId: history.paymentHistoryId,
            eventType: history.eventType,
            eventTime: moment(history.eventTime).format("YYYY-MM-DD FHH:mm:ss"),
            details: history.details,
            status: history.status,
            createdAt: moment(history.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(history.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            paymentId: history.paymentId,
          }));
          setPaymentHistories(formattedData);
        }
      } catch (error) {
        toast.error("Failed to fetch payment histories. Please try again.");
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
        <title>Payment Histories | Smart-Parking</title>
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
            <Typography variant="h4">Payment Histories</Typography>
            <PaymentHistoriesTable
              histories={applyPagination(paymentHistories, page, rowsPerPage)}
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

PaymentHistoriesIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PaymentHistoriesIndexPage;
