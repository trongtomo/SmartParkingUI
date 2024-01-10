// pages/payments/[paymentId].js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PaymentDetailsPage = () => {
  const [payment, setPayment] = useState({});
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  const router = useRouter();
  const paymentId = router.query.paymentId;

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails(paymentId);
    }
  }, [paymentId]);

  const fetchPaymentDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPayment(response.data.data);
      } else {
        toast.error("Failed to fetch payment details. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to fetch payment details. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>{`Payment Details | Smart-Parking`}</title>
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
            <Typography variant="h4">{`Payment Details #${payment.paymentId || ""}`}</Typography>
            {/* Render details based on payment status */}
            {payment.status === "success" && (
              <>
                {/* Display success status details */}
                <Typography variant="body1">{`Amount: ${payment.amount}`}</Typography>
                <Typography variant="body1">{`Payment Method: ${payment.paymentMethod}`}</Typography>
                <Typography variant="body1">{`Transaction ID: ${payment.transactionId}`}</Typography>
                <Typography variant="body1">{`Timestamp: ${moment(payment.timestamp).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`}</Typography>
                {/* Add more details specific to the success status if needed */}
              </>
            )}
            {payment.status === "failed" && (
              <>
                {/* Display failed status details */}
                <Typography variant="body1">{`Failure Reason: ${payment.failureReason}`}</Typography>
                <Typography variant="body1">{`Timestamp: ${moment(payment.timestamp).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}`}</Typography>
                {/* Add more details specific to the failed status if needed */}
              </>
            )}
            {/* Add more conditions for other payment statuses if needed */}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PaymentDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PaymentDetailsPage;
