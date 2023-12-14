// pages/admin/users/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/sections/users/users-table";
import { UsersSearch } from "src/sections/users/users-search";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
const apiUrl = `http://localhost:3000`;

const UsersIndexPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
  });
  const router = useRouter();
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xMVQxMTozMDowNi4yMzRaIn0sImlhdCI6MTcwMjI5NDIwNn0.lE8-J7-qlDNQcXmqEVhTdOZ5jylF9BDEI1Ow0rBBdn8";

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/users`, {
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

  const handleCreateUser = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/admin/users`,
        {
          username: newUser.username,
          password: newUser.password,
          fullName: newUser.fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data && response.data.data.user) {
        const createdUser = response.data.data.user;
        // router.push(`/admin/users/${createdUser.userId}`); // Redirect to the details page of the created user
        toast.success("User created successfully!", { autoClose: 2000 });
      } else {
        console.error("Failed to create user:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error");
    }
  };

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
            <div style={{ textAlign: "left" }}>
              <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
                Create New User
              </Button>
            </div>
            {/* Create User Form */}
            <Dialog
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create New User</DialogTitle>
              <DialogContent>
                <DialogContentText>Fill in the details for the new user:</DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  fullWidth
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <TextField
                  margin="dense"
                  id="fullName"
                  label="Full Name"
                  type="text"
                  fullWidth
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsFormOpen(false)} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} color="primary">
                  Create
                </Button>
              </DialogActions>
            </Dialog>

            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Users</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  {/* Add import/export buttons */}
                </Stack>
              </Stack>
              <div>{/* Add 'Add User' button */}</div>
            </Stack>
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
