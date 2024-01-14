// pages/orders/[orderId].js
"use-client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Card, CardContent } from "@mui/material";
import moment from "moment";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const router = useRouter();
  const orderId = 5;

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/parkingOrders/getAllParkingOrdersByBike?bikeId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 200) {
        const orderDetails = response.data.data.parkingOrders[0];
        setOrder(orderDetails);
      } else {
        toast.error("Failed to fetch order details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to fetch order details. Please try again later.");
    }
  };

  useEffect(() => {
    // Fetch order details when the component mounts
    fetchOrderDetails();
  }, []);

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
            <Typography variant="h4">{`Order Details #${order?.parkingOrderId}`}</Typography>

            {order && (
              <Card>
                <CardContent>
                  <Typography variant="h6">Status: {order.parkingOrderStatus}</Typography>
                  <Typography variant="h6">Amount: {order.parkingOrderAmount}</Typography>
                  <Typography variant="h6">
                    Expired Date: {moment(order.expiredDate).format("YYYY-MM-DD")}
                  </Typography>
                  <Typography variant="h6">
                    Created At: {moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                  <Typography variant="h6">
                    Updated At: {moment(order.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                  {/* Include other details as needed */}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

OrderDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default OrderDetailsPage;
