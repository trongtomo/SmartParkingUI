"use client";
import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";
import { OrdersTable } from "src/sections/orders/orders-table"; // Assuming you have an OrdersTable component
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { applyPagination } from "src/utils/apply-pagination";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const searchData = useRef([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showActive, setShowActive] = useState(true);
  const [showPending, setShowPending] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const auth = useAuthContext();
  const token = localStorage.accessToken;

  const getDataListFilter = useCallback(() => {
    if (orders.length === 0) {
      return;
    }

    const updatedArr = orders.filter(
      (e) =>
        (showActive && e.parkingOrderStatus === "active") ||
        (showPending && e.parkingOrderStatus === "pending") ||
        (showCancelled && e.parkingOrderStatus === "cancelled")
    );

    setFilteredOrders(updatedArr);
    searchData.current = updatedArr;
    setPage(0);
  }, [orders, showActive, showPending, showCancelled]);

  const handleSearch = useCallback((value) => {
    if (searchData.current === 0) {
      return;
    }

    if (!value) {
      setFilteredOrders(searchData.current);
      return;
    }

    const filteredData = searchData.current.filter((item) =>
      item?.plateNumber?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOrders(filteredData);
    setPage(0);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/parkingOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.code === 200) {
          if (response.data.data === "No parking orders found") {
            toast.warning("No parking orders found");
          } else {
            const formattedData = response.data.data.parkingOrders.map((order) => ({
              parkingOrderId: order.parkingOrderId,
              parkingOrderStatus: order.parkingOrderStatus,
              parkingOrderAmount: order.parkingOrderAmount,
              expiredDate: order.expiredDate ? moment(order.expiredDate).format("YYYY-MM-DD") : "",
              createdAt: moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(order.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
              description: order.description,
              bikeId: order.bikeId,
              // parkingType: order.parkingTypeId,
              plateNumber: order.Bike.plateNumber,
              parkingType: order.ParkingType.parkingTypeName,
            }));
            setOrders(formattedData);
            setFilteredOrders(formattedData);
          }
        } else {
          toast.error("Failed to fetch parking orders. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to fetch parking orders. Please try again.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getDataListFilter();
  }, [getDataListFilter]);

  useEffect(() => {
    handleSearch(searchQ);
  }, [showActive, showPending, showCancelled, searchQ]);

  return (
    <>
      <Head>
        <title>Parking Orders | Smart-Parking</title>
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
              <Stack spacing={1}>
                <Typography variant="h4">Parking Orders</Typography>
              </Stack>
            </Stack>
            <TextField
              label="Search by Plate Number"
              variant="outlined"
              value={searchQ}
              onChange={(event) => {
                setSearchQ(event.target.value);
                handleSearch(event.target.value);
              }}
            />
            <Stack spacing={1} direction="row">
              <FormControlLabel
                control={
                  <Checkbox checked={showActive} onChange={() => setShowActive(!showActive)} />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={showPending} onChange={() => setShowPending(!showPending)} />
                }
                label="Pending"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCancelled}
                    onChange={() => setShowCancelled(!showCancelled)}
                  />
                }
                label="Cancelled"
              />
            </Stack>

            <OrdersTable
              count={filteredOrders.length}
              items={applyPagination(filteredOrders, page, rowsPerPage)}
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

OrderPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default OrderPage;
