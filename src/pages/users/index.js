// pages/admin/users/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/sections/users/users-table";
import { UsersSearch } from "src/sections/users/users-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const apiUrl = `http://localhost:3000/api/admin/users`;
const UsersIndexPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA2NjExNDE0IiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQwOTo1MzoyMy4xMTBaIn0sImlhdCI6MTcwMjExNTYwM30.FhA6rTVWvi05cYuzs_Jp8bqJajeKqEHhKyO9NvDj_A4";

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
          const formattedData = response.data.data.users.map((user) => ({
            userId: user.userId,
            fullName: user.fullName,
            username: user.username,
            isActive: user.isActive,
            firebaseToken: user.firebaseToken,
            createdAt: moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          }));

          setUsers(formattedData);
        }
      } catch (error) {
        toast.error("Failed to fetch users. Please try again.");
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
        <title>Users | Smart-Parking</title>
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
                <Typography variant="h4">Users</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  {/* Add import/export buttons */}
                </Stack>
              </Stack>
              <div>{/* Add 'Add User' button */}</div>
            </Stack>
            {/* Add UsersSearch component */}
            {/* Add UsersTable component */}
            <UsersTable
              count={users.length}
              items={applyPagination(users, page, rowsPerPage)}
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

UsersIndexPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UsersIndexPage;
