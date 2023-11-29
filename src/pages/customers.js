import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RegistrationsTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment"; // Import moment

const apiUrl = "https://server.smartparking.site/api/admin/registrations/allRegistrations";
const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6NCwidXNlcm5hbWUiOiIwOTA2NjExNDEyIiwiY3JlYXRlZEF0IjoiMjAyMy0xMS0yOVQwMToyMDo0NS4xMjRaIn0sImlhdCI6MTcwMTIyMDg0NX0.ojYyZABijQYbN4Mgkfy8gzUYM8xxzsjPj77hLTP0MfA";

const Page = () => {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customersSelection = useSelection([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response.data.code === 200) {
          const formattedData = response.data.data.map((registration) => ({
            registrationId: registration.registrationId,
            registrationStatus: registration.registrationStatus,
            amount: registration.amount,
            approvedBy: registration.approvedBy,
            expiredDate: registration.expiredDate,
            faceImage: registration.faceImage,
            plateNumber: registration.plateNumber,
            hasPayment: registration.hasPayment,
            model: registration.model,
            registrationNumber: registration.registrationNumber,
            manufacture: registration.manufacture,
            gender: registration.gender,
            createdAt: moment(registration.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(registration.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            userId: registration.userId,
          }));
          setRegistrations(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch />
            <RegistrationsTable
              count={registrations.length}
              items={applyPagination(registrations, page, rowsPerPage)}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
