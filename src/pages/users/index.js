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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "src/sections/users/users-table";
import { applyPagination } from "src/utils/apply-pagination";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showUser, setShowUser] = useState(true);

  const router = useRouter();
  const auth = useAuthContext();
  const token = auth.user.accessToken;
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
            roleId: user.roleId,
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
        router.push(`${apiUrl}/admin/users/${createdUser.userId}`); // Redirect to the details page of the created user
        toast.success("Security created successfully!", { autoClose: 2000 });
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
                Create New Security
              </Button>
            </div>
            {/* Create User Form */}
            <Dialog
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create New Security</DialogTitle>
              <DialogContent>
                <DialogContentText>Fill in the details for the new Security:</DialogContentText>
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
                  {/* Create User Form */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showAdmin}
                        onChange={(e) => setShowAdmin(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show Admin"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showSecurity}
                        onChange={(e) => setShowSecurity(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show Security"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showUser}
                        onChange={(e) => setShowUser(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show User"
                  />
                </Stack>
              </Stack>
            </Stack>
            <UsersTable
              count={users.length}
              items={applyPagination(
                users.filter((user) => {
                  if (showAdmin && user.roleId === 1) return true;
                  if (showSecurity && user.roleId === 2) return true;
                  if (showUser && user.roleId === 3) return true;
                  return false;
                }),
                page,
                rowsPerPage
              )}
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
