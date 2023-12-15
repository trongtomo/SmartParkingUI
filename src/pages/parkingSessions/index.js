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

const apiUrl = `https://smart-parking-server-dev.azurewebsites.net/api/admin/sessions`;
const ParkingSessionsIndexPage = () => {
  const [parkingSessions, setParkingSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNVQwMTowODo1MS4zMjZaIn0sImlhdCI6MTcwMjYwMjUzMX0.5QLM-Kh-HKgxR79v0cYRhntZC0DGYFlZt9UspIDWk9I";

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
          const formattedData = response.data.data.parkingSessions.map((session) => ({
            parkingSessionId: session.parkingSessionId,
            checkinCardId: session.checkinCardId,
            checkinTime: session.checkinTime
              ? moment(session.checkinTime).format("YYYY-MM-DD HH:mm:ss")
              : "",
            checkoutCardId: session.checkoutCardId,
            checkoutTime: session.checkoutTime
              ? moment(session.checkoutTime).format("YYYY-MM-DD HH:mm:ss")
              : "",
            approvedBy: session.approvedBy,
            plateNumber: session.plateNumber,
            parkingFee: session.parkingFee,
            createdAt: moment(session.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            // updatedAt: moment(session.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          }));
          setParkingSessions(formattedData);
        }
      } catch (error) {
        toast.error("Failed to fetch sessions. Please try again later.");
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Parking Sessions</Typography>
            </Stack>
            <ParkingSessionsTable
              count={parkingSessions.length}
              items={applyPagination(parkingSessions, page, rowsPerPage)}
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
