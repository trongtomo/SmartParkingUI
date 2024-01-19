// pages/parkingSessions/index.js

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Popover } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ParkingSessionsTable } from "src/sections/parkingSessions/parkingSessions-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { ParkingSessionsSearch } from "src/sections/parkingSessions/parkingSessions-search";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const ParkingSessionsIndexPage = () => {
  const [parkingSessions, setParkingSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(7, "days").toDate()); // Default to 7 days ago
  const [endDate, setEndDate] = useState(new Date());

  const [searchTerm, setSearchTerm] = useState("");
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (startDate && endDate) {
          const response = await axios.get(`${apiUrl}/api/admin/sessions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              dateStart: startDate ? startDate.toISOString() : null,
              dateEnd: endDate ? endDate.toISOString() : null,
            },
          });

          if (response.data.code === 200) {
            const filteredData = response.data.data.parkingSessions.filter((session) =>
              session.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const formattedData = filteredData.map((session) => ({
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
              parkingTypeGroup: session.parkingTypeGroup,
              updatedAt: moment(session.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            }));

            setParkingSessions(formattedData);
          } else {
            // No records found
            toast.info("No sessions found for this date range");
            setParkingSessions([]); // Explicitly set parkingSessions to an empty array
          }
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Failed to fetch sessions. Please try again later.");
      }
    };

    fetchData();
  }, [startDate, endDate, searchTerm]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const handleToggleDatePicker = (event) => {
    setShowDatePicker(!showDatePicker);
    setAnchorEl(event.currentTarget);
  };
  const formatDateRangeText = () => {
    if (!startDate || !endDate) {
      return "Select Date Range";
    }
    return `${moment(startDate).format("YYYY/MM/DD")} --- ${moment(endDate).format("YYYY/MM/DD")}`;
  };
  const handleSearch = (term) => {
    setPage(0); // Reset page when searching
    setSearchTerm(term);
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
            <ParkingSessionsSearch onSearch={handleSearch} />
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleToggleDatePicker}>Choose Date: {formatDateRangeText()}</Button>

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                open={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                anchorEl={anchorEl}
              />
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

const DateRangePicker = ({ startDate, endDate, onDateChange, open, onClose, anchorEl }) => (
  <Popover
    open={open}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
  >
    <Box p={2}>
      <DatePicker
        selected={startDate}
        onChange={onDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
    </Box>
  </Popover>
);
