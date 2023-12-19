"use client";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Popover, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TotalCheckoutGuest } from "src/sections/overview/TotalCheckoutGuest";
import { TotalCheckinGuest } from "src/sections/overview/TotalCheckinGuest";
import { TotalCheckoutResident } from "src/sections/overview/TotalCheckoutResident";
import { TotalCheckinResident } from "src/sections/overview/TotalCheckinResident";
import { TotalGuestIncome } from "src/sections/overview/TotalGuestIncome";
import { IncomeGroupByDate } from "src/sections/overview/IncomeGroupByDate";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/contexts/auth-context";
import { Stack } from "@mui/system";

const Page = () => {
  const [totalCheckoutGuest, setTotalCheckoutGuest] = useState(null);
  const [totalCheckinGuest, setTotalCheckinGuest] = useState(null);
  const [totalCheckoutResident, setTotalCheckoutResident] = useState(null);
  const [totalCheckinResident, setTotalCheckinResident] = useState(null);
  const [totalGuestIncome, setTotalGuestIncome] = useState(null);

  const [dateStart, setdateStart] = useState(new Date());
  const [dateEnd, setdateEnd] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateStart, setSelectedDateStart] = useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [chartSeries, setChartSeries] = useState([]);
  const auth = useAuthContext();
  const token = auth.user.accessToken;

  useEffect(() => {
    const dateStart = moment(selectedDateStart).format("YYYY-MM-DD HH:mm:ss");
    const dateEnd = moment(selectedDateEnd).format("YYYY-MM-DD HH:mm:ss");
    const fetchCheckoutGuestData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckout?parkingTypeName=guest&dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalCheckoutGuest(response.data.data);
        } else {
          // Handle error if needed
          console.error("Failed to fetch total customers:", response.data);
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error fetching total customers:", error);
      }
    };
    const fetchCheckinGuestData = async () => {
      try {
        // Adjust the API endpoint and parameters accordingly
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckin?parkingTypeName=guest&dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalCheckinGuest(response.data.data);
        } else {
          console.error("Failed to fetch total checkin data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching total checkin data:", error);
      }
    };
    const fetchCheckoutResidentData = async () => {
      try {
        // Adjust the API endpoint and parameters accordingly

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckout?parkingTypeName=resident&dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalCheckoutResident(response.data.data);
        } else {
          console.error("Failed to fetch total checkin data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching total checkin data:", error);
      }
    };
    const fetchCheckinResidentData = async () => {
      try {
        // Adjust the API endpoint and parameters accordingly

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckin?parkingTypeName=resident&dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalCheckinResident(response.data.data);
        } else {
          console.error("Failed to fetch total checkin data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching total checkin data:", error);
      }
    };
    const fetchGuestIncome = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalGuestInCome?dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalGuestIncome(response.data.data);
        } else {
          // Handle error if needed
          console.error("Failed to fetch total customers:", response.data);
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error fetching total customers:", error);
      }
    };
    const fetchIncomeGroupByDate = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getGuestIncomeGroupByDate?dateStart=${dateStart}&dateEnd=${dateEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.data;
          const chartData = data.map((item) => ({
            x: new Date(item.date).toLocaleDateString(),
            y: item.totalParkingFee,
          }));
          setChartSeries([{ data: chartData }]);
        } else {
          console.error("Failed to fetch total customers:", response.data);
        }
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    fetchIncomeGroupByDate();
    fetchGuestIncome();
    fetchCheckinGuestData();
    fetchCheckoutGuestData();
    fetchCheckinResidentData();
    fetchCheckoutResidentData();
  }, [selectedDateStart, selectedDateEnd]);

  const handleTotalCheckoutGuest = (value) => {
    setTotalCheckoutGuest(value);
  };
  const handleTotalCheckinGuest = (value) => {
    setTotalCheckinGuest(value);
  };
  const handleTotalCheckoutResident = (value) => {
    setTotalCheckoutResident(value);
  };
  const handleTotalCheckinResident = (value) => {
    setTotalCheckinResident(value);
  };
  const handleTotalGuestIncome = (value) => {
    setTotalGuestIncome(value);
  };
  const handleTotalIncomeGroupByDate = (value) => {
    setTotalGuestIncome(value);
  };
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSelectedDateStart(start);
    setSelectedDateEnd(end);
  };

  const handleToggleDatePicker = (event) => {
    setShowDatePicker(!showDatePicker);
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <Head>
        <title>Overview | Smart Parking</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Button onClick={handleToggleDatePicker}>Choose Date</Button>
            <DateRangePicker
              startDate={selectedDateStart}
              endDate={selectedDateEnd}
              onDateChange={handleDateChange}
              open={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              anchorEl={anchorEl}
            />
          </Stack>
          <Grid container spacing={3}>
            <Grid xs={12} sm={5} lg={3}>
              <TotalCheckoutGuest
                handleCheckoutValueGuest={setTotalCheckoutGuest}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
                value={totalCheckoutGuest}
              />
            </Grid>
            <Grid xs={12} sm={5} lg={3}>
              <TotalCheckinGuest
                handleCheckinValueGuest={setTotalCheckinGuest}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
                value={totalCheckinGuest}
              />
            </Grid>
            {/* Resident card */}
            <Grid xs={12} sm={5} lg={3}>
              <TotalCheckinResident
                handleCheckoutValueResident={setTotalCheckinResident}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
                value={totalCheckinResident}
              />
            </Grid>
            <Grid xs={12} sm={5} lg={3}>
              <TotalCheckoutResident
                handleCheckoutValueResident={setTotalCheckoutResident}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
                value={totalCheckoutResident}
              />
            </Grid>
            <Grid xs={12} sm={5} lg={3}>
              <TotalGuestIncome
                handleTotalGuestIncome={setTotalGuestIncome}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
                value={totalGuestIncome}
              />
            </Grid>
            <Grid xs={12} lg={8}>
              <IncomeGroupByDate
                chartSeries={chartSeries}
                startDate={dateStart}
                endDate={dateEnd}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                guestCheckins={totalCheckinGuest}
                residentCheckins={totalCheckinResident}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
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
