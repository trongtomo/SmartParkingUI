// pages/registrations/index.js

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RegistrationsTable } from "src/sections/registrations/registrations-table";
import { RegistrationsSearch } from "src/sections/registrations/registrations-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const registrationsRef = useRef(null);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPaid, setShowPaid] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const auth = useAuthContext();
  const token = auth.user.accessToken;

  const getDataListFilter = useCallback(() => {
    if (registrations.length === 0) {
      return;
    }
    if (showActive) {
      const updatedArr = registrations.filter((e) => showActive && e.status === "active");
      setRegistrations(updatedArr);
      setFilteredRegistrations(updatedArr);
      setPage(0);
      return;
    }
    setRegistrations(registrationsRef.current);
    setFilteredRegistrations(registrationsRef.current);
    setPage(0);
  }, [showActive]);

  const handleSearch = useCallback(
    (value) => {
      const filteredData = registrations.filter((item) => item?.plateNumber?.includes(value));

      const statusFilteredData = filteredData.filter((item) => {
        if (showActive && item.status === "active") {
          return true;
        }

        if (showInactive && item.status === "inactive") {
          return true;
        }

        if (showVerified && (item.status === "verified" || item.status === "created")) {
          return true;
        }

        return false;
      });

      setFilteredRegistrations(statusFilteredData);
      setPage(0);
    },
    [registrations, showActive, showInactive, showVerified]
  );

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
              status: registration.status,
              approvedBy: registration.approvedBy,
              expiredDate: registration.expiredDate
                ? moment(registration.expiredDate).format("YYYY-MM-DD HH:mm:ss")
                : "",
              plateNumber: registration.plateNumber,
              createdAt: moment(registration.createdAt).format("YYYY-MM-DD HH:mm:ss"),
              updatedAt: moment(registration.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            }));
            setRegistrations(formattedData);
            setFilteredRegistrations(formattedData);
            registrationsRef.current = formattedData;
          }
        } else {
          toast.error("Failed to fetch registrations. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to fetch registrations. Please try again.");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    getDataListFilter();
  }, [getDataListFilter]);

  useEffect(() => {
    if (searchQ) {
      handleSearch(searchQ);
    }
  }, [registrations]);

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
                control={<Checkbox checked={showPaid} onChange={() => setShowPaid(!showPaid)} />}
                label="Paid"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showInactive}
                    onChange={() => setShowInactive(!showInactive)}
                  />
                }
                label="Inactive"
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
                  <Checkbox checked={showActive} onChange={() => setShowActive(!showActive)} />
                }
                label="Active"
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
