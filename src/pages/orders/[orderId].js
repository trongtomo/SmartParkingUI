// pages/orders/[orderId].js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import moment from "moment";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const router = useRouter();
  const orderId = router.query.orderId;

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/parkingOrders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 200) {
        const orderDetails = response.data.data; // Directly access the data field
        setOrder(orderDetails);
      } else {
        toast.error("Failed to fetch order details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details. Please try again later.");
    }
  };

  const fetchPaymentsForOrder = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/payments/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const paymentData = response.data.data;
        setPayments(paymentData); // Assuming payments are directly available in the data field
      } else {
        toast.error("Failed to fetch payments for the order. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments. Please try again later.");
    }
  };

  useEffect(() => {
    // Fetch order details and payments when the component mounts
    fetchOrderDetails();
    fetchPaymentsForOrder();
  }, [orderId]);

  return (
    <>
      <Head>
        <title>{`Order Details | ${
          order ? `Order #${order.parkingOrderId}` : "Loading..."
        }`}</title>
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => router.back()} variant="contained">
                Back
              </Button>
              <Typography variant="h4">{`Order Details #${order?.parkingOrderId}`}</Typography>
            </Stack>
            {order !== null && (
              <Paper elevation={3}>
                <Grid container spacing={3} p={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Status: {order.parkingOrderStatus}</Typography>
                    <Typography variant="h6">Amount: {order.parkingOrderAmount}</Typography>
                    <Typography variant="h6">Order Type: {order.parkingOrderType}</Typography>
                    <Typography variant="h6">
                      Expired Date: {moment(order.expiredDate).format("YYYY-MM-DD")}
                    </Typography>
                    <Typography variant="h6">
                      Parking Type : {order.ParkingType.parkingTypeName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6">Description: {order.description || "N/A"}</Typography>
                    <Typography variant="h6">
                      Bike ID:
                      <Button href={`/bikes/${order.bikeId}`}>{order.bikeId}</Button>
                    </Typography>
                    <Typography variant="h6">
                      Created At: {moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </Typography>
                    <Typography variant="h6">
                      Updated At: {moment(order.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            <PaymentsSection payments={payments} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

OrderDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default OrderDetailsPage;

const PaymentsSection = ({ payments }) => (
  <Paper elevation={3}>
    <Stack spacing={3} p={3}>
      <Typography variant="h5">Payments</Typography>
      {payments.map((payment) => (
        <Card key={payment.paymentId}>
          <CardContent>
            <Typography variant="h6">Transaction ID: {payment.transactionId}</Typography>
            <Typography variant="h6">Amount: {payment.paymentAmount}</Typography>
            <Typography variant="h6">Payment Status: {payment.paymentStatus}</Typography>
            <Typography variant="h6">Payment Method: {payment.paymentMethod}</Typography>
            <Typography variant="h6">
              Payment Date: {moment(payment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Paper>
);
