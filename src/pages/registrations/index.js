import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RegistrationsTable } from "src/sections/registrations/registrations-table";
import { RegistrationsSearch } from "src/sections/registrations/registrations-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import { toast } from "react-toastify";

const apiUrl = `http://localhost:3000/api/admin/registrations/allRegistrations`;
const RegistrationPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNFQxNzoxMDoxMS43NjBaIn0sImlhdCI6MTcwMjU3MzgxMX0.HrFRgoBb_HHBWsKYaXf6h0wGtFbLRDr1i_S4WJVnv2Y";
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
        }
      } catch (error) {
        toast.error("Failed to fetch registrations. Please try again.");
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
            <RegistrationsSearch />

            <RegistrationsTable
              count={registrations.length}
              items={applyPagination(registrations, page, rowsPerPage)}
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
