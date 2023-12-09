// pages/parkingSessions/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ParkingSessionsTable } from "src/sections/parkingSessions/parkingSessions-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = `https://server-dev.smartparking.site/api/admin/sessions`;
const ParkingSessionsIndexPage = () => {
  const [parkingSessions, setParkingSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MTEsInVzZXJuYW1lIjoiMDg2NzY5ODc3NyIsImNyZWF0ZWRBdCI6IjIwMjMtMTItMDlUMTc6NDE6NDYuNTU4WiJ9LCJpYXQiOjE3MDIxNDM3MDZ9.pioIH4R9-HhLGcmyvuyST_nRR4pNq-tsEeBae7J7rhA";

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
          const parkingSessions = response.data.data.parkingSessions;
          const formattedData = parkingSessions.map((session) => ({
            parkingSessionId: session.parkingSessionId,
            cardId: session.cardId,
            checkinTime: moment(session.checkinTime).format("YYYY-MM-DD FHH:mm:ss"),
            checkoutTime: moment(session.checkoutTime).format("YYYY-MM-DD HH:mm:ss"),
            approvedBy: session.approvedBy,
            plateNumber: session.plateNumber,
            parkingFee: session.parkingFee,
            createdAt: moment(session.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(session.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            parkingTypeId: session.parkingTypeId, // Add this line to include parkingTypeId
            ParkingType: {
              parkingTypeId: session.ParkingType.parkingTypeId,
              name: session.ParkingType.name,
              description: session.ParkingType.description,
              createdAt: moment(session.ParkingType.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(session.ParkingType.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
          }));

          setParkingSessions(formattedData);
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const statusCode = error.response.status;

          if (statusCode === 401) {
            toast.error("Unauthorized. Please log in again.");
          } else {
            toast.error(`Server responded with ${statusCode}. Please try again later.`);
          }
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response from the server. Please check your internet connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          toast.error("An unexpected error occurred. Please try again.");
        }
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
        <title>Parking Sessions | Smart-Parking</title>
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
            <Typography variant="h4">Parking Sessions</Typography>

            <ParkingSessionsTable
              sessions={applyPagination(parkingSessions, page, rowsPerPage)}
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

ParkingSessionsIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ParkingSessionsIndexPage;
