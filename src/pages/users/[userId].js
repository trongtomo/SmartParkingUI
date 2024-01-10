"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuthContext } from "src/contexts/auth-context";
import { UserHistoriesTable } from "src/sections/users/users-history-table";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const UserDetailPage = () => {
  const router = useRouter();
  const userId = router.query.userId;
  const [user, setUser] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const auth = useAuthContext();
  const token = auth.user?.accessToken;

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Security";
      case 3:
        return "User";
      default:
        return "Unknown";
    }
  };

  const handleActivate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/users/active/${user.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User activated successfully");
        setUser((prev) => ({ ...prev, userStatus: "active" }));
        // router.replace(router.asPath); // Reload the page
      } else {
        console.error("Failed to activate user:", response.data.message);
        toast.error("Failed to activate user. Please try again.");
      }
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user. Something wrong!.");
    }
  };
  const handleDeactivate = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/users/deactive/${user.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("User deactivated successfully");
        setUser((prev) => ({ ...prev, userStatus: "inactive" }));
      } else {
        console.error("Failed to deactivate user:", response.data.message);
        toast.error("Failed to deactivate user. Please try again.");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user. Something went wrong.");
    }
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userDetails = response.data?.data?.user || {};
        setUser(userDetails);

        const userHistoriesResponse = await axios.get(
          `${apiUrl}/api/admin/users/${userId}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userHistories = userHistoriesResponse.data?.data?.userHistories || [];
        setUser((prev) => ({ ...prev, userHistories }));
      } catch (err) {
        console.error("ERR", err);
      }
    };

    getUserDetails();
  }, []);

  if (!user) {
    return (
      <>
        <Head>
          <title>User Not Found | Smart-Parking</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4">User Not Found</Typography>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`User #${user.userId} | Smart-Parking`}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => router.back()}>Back</Button>
              <Typography variant="h4">{`User #${user.userId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={4}>
                <Typography variant="body1">{`Full Name: ${user.userFullName}`}</Typography>
                <Typography variant="body1">{`Address: ${user.address || "N/A"}`}</Typography>
                <Typography variant="body1">{`Age: ${user.age || "N/A"}`}</Typography>
                <Typography variant="body1">{`Gender: ${user.gender || "N/A"}`}</Typography>
                <Typography variant="body1">{`Role: ${getRoleName(user.roleId)}`}</Typography>
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <Typography variant="body1">{`User Status: ${user.userStatus}`}</Typography>
                <Typography variant="body1">{`Username: ${user.username}`}</Typography>
                <Typography variant="body1">{`Firebase Token: ${
                  user.firebaseToken || "N/A"
                }`}</Typography>
                <Typography variant="body1">{`Created At: ${user.createdAt}`}</Typography>
                <Typography variant="body1">{`Updated At: ${user.updatedAt}`}</Typography>
              </Grid>
            </Grid>
            {/* { button logic here} */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleActivate}
                disabled={user.userStatus === "active"}
              >
                Activate
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeactivate}
                disabled={user.userStatus === "inactive"}
              >
                Deactivate
              </Button>
            </Stack>
            {/* User Histories Table */}
            <Typography variant="h5">User Histories</Typography>
            <UserHistoriesTable
              count={user.userHistories ? user.userHistories.length : 0}
              items={user.userHistories || []}
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

UserDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UserDetailPage;
