import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuthContext } from "src/contexts/auth-context";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [startDate, setStartDate] = useState(new Date()); // Initial start date
  const [endDate, setEndDate] = useState(new Date()); // Initial end date
  const [checkinCount, setCheckinCount] = useState(null);
  const [selectedParkingType, setSelectedParkingType] = useState("resident");
  const [totalGuestIncome, setTotalGuestIncome] = useState(null);
  const auth = useAuthContext();
  const token = auth.user?.accessToken;

  const fetchData = async () => {
    try {
      // Format dates to ISO string format
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      // Fetch data from the API
      const response = await axios.get(`${apiUrl}/api/admin/getTotalCheckin`, {
        params: {
          parkingTypeName: selectedParkingType,
          dateStart: formattedStartDate,
          dateEnd: formattedEndDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCheckinCount(response.data.data);
      } else {
        console.error("Failed to fetch data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleParkingTypeChange = (event) => {
    setSelectedParkingType(event.target.value);
  };
  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkin Data
        </Typography>
        <Card>
          <CardContent>
            <Stack spacing={2} direction="row" alignItems="center">
              <TextField
                label="Start Date"
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => handleStartDateChange(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => handleEndDateChange(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl>
                <InputLabel>Parking Type</InputLabel>
                <Select
                  value={selectedParkingType}
                  onChange={handleParkingTypeChange}
                  style={{ minWidth: 120 }}
                >
                  <MenuItem value="resident">Resident</MenuItem>
                  <MenuItem value="guest">Guest</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Typography variant="h6" align="center" gutterBottom>
              Checkin Count: {checkinCount !== null ? checkinCount : "Loading..."}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
