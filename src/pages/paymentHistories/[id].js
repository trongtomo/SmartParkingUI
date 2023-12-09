// pages/paymentHistories/[id].js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:3000/api/admin/paymentHistories";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA2NjExNDE0IiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQwOTo1MzoyMy4xMTBaIn0sImlhdCI6MTcwMjExNTYwM30.FhA6rTVWvi05cYuzs_Jp8bqJajeKqEHhKyO9NvDj_A4";
const PaymentHistoryDetailPage = ({ paymentHistory }) => {
  return (
    <>
      <Head>
        <title>{`Payment History #${paymentHistory.paymentHistoryId} | Smart-Parking`}</title>
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
            <Typography variant="h4">{`Payment History #${paymentHistory.paymentHistoryId}`}</Typography>
            <Typography variant="body1">{`Event Type: ${paymentHistory.eventType}`}</Typography>
            <Typography variant="body1">{`Event Time: ${paymentHistory.eventTime}`}</Typography>
            <Typography variant="body1">{`Details: ${paymentHistory.details}`}</Typography>
            <Typography variant="body1">{`Status: ${paymentHistory.status}`}</Typography>
            <Typography variant="body1">{`Created At: ${paymentHistory.createdAt}`}</Typography>
            <Typography variant="body1">{`Updated At: ${paymentHistory.updatedAt}`}</Typography>
            <Typography variant="body1">{`Payment ID: ${paymentHistory.paymentId}`}</Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PaymentHistoryDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PaymentHistoryDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { id } = params;

  try {
    const response = await axios.get(`${apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.paymentHistory) {
      const paymentHistory = response.data.data.paymentHistory;
      return {
        props: { paymentHistory },
      };
    } else {
      return {
        props: { paymentHistory: null },
      };
    }
  } catch (error) {
    console.error("Error fetching payment history data:", error);
    return {
      props: { paymentHistory: null },
    };
  }
};
