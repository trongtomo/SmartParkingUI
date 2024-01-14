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
import { RegistrationsSearch } from "src/sections/registrations/registrations-search";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";
import { RegistrationsTable } from "src/sections/registrations/registrations-table";
import { applyPagination } from "src/utils/apply-pagination";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const searchData = useRef([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPending, setShowPending] = useState(true);
  const [showVerified, setShowVerified] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const token = localStorage.accessToken;

  const getDataListFilter = useCallback(() => {
    if (registrations.length === 0) {
      return;
    }

    const updatedArr = registrations.filter(
      (e) =>
        (showPending && e.registrationStatus === "pending") ||
        (showVerified && e.registrationStatus === "verified") ||
        (showRejected && e.registrationStatus === "rejected")
    );

    setFilteredRegistrations(updatedArr);
    searchData.current = updatedArr;
    setPage(0);
  }, [registrations, showPending, showVerified, showRejected]);

  const handleSearch = useCallback((value) => {
    if (searchData.current === 0) {
      return;
    }

    if (!value) {
      setFilteredRegistrations(searchData.current);
      return;
    }

    const filteredData = searchData.current.filter((item) =>
      item?.plateNumber?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRegistrations(filteredData);
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
        const response = await axios.get(`${apiUrl}/api/admin/registrations/allRegistrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.code === 200) {
          if (response.data.data === "No registrations found") {
            toast.warning("No registrations found");
          } else {
            const formattedData = response.data.data.map((registration) => ({
              registrationId: registration.registrationId,
              username: registration.User.username,
              registrationStatus: registration.registrationStatus,
              approvedBy: registration.approvedBy,
              expiredDate: registration.expiredDate
                ? moment(registration.expiredDate).format("YYYY-MM-DD HH:mm:ss")
                : "",
              plateNumber: registration.plateNumber,
              createdAt: moment(registration.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(registration.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
              userId: registration.userId,
            }));

            setRegistrations(formattedData);
            setFilteredRegistrations(formattedData);
          }
        } else {
          toast.error("Failed to fetch registrations. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to fetch registrations. Please try again.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getDataListFilter();
  }, [getDataListFilter]);

  useEffect(() => {
    handleSearch(searchQ);
  }, [showPending, showVerified, showRejected, searchQ]);

  return (
    <>
      <Head>
        <title>Registration | Smart-Parking</title>
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
                <Typography variant="h4">Registration</Typography>
              </Stack>
            </Stack>
            <RegistrationsSearch
              value={searchQ}
              onChange={(event) => {
                setSearchQ(event.target.value);
                handleSearch(event.target.value);
              }}
            />
            <Stack spacing={1} direction="row">
              <FormControlLabel
                control={
                  <Checkbox checked={showPending} onChange={() => setShowPending(!showPending)} />
                }
                label="Pending"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showVerified}
                    onChange={() => setShowVerified(!showVerified)}
                  />
                }
                label="Verified"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showRejected}
                    onChange={() => setShowRejected(!showRejected)}
                  />
                }
                label="Rejected"
              />
            </Stack>

            <RegistrationsTable
              count={filteredRegistrations.length}
              items={applyPagination(filteredRegistrations, page, rowsPerPage)}
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

RegistrationPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RegistrationPage;
