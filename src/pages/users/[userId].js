import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNFQxNzoxMDoxMS43NjBaIn0sImlhdCI6MTcwMjU3MzgxMX0.HrFRgoBb_HHBWsKYaXf6h0wGtFbLRDr1i_S4WJVnv2Y";

const UserDetailPage = ({ user }) => {
  const router = useRouter();
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
        router.replace(router.asPath); // Reload the page
      } else {
        console.error("Failed to active user:", response.data.message);
        toast.error("Failed to active user. Please try again.");
      }
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to active user. Something wrong!.");
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
        toast.success("User activated successfully");
        router.replace(router.asPath); // Reload the page
      } else {
        console.error("Failed to deactive user:", response.data.message);
        toast.error("Failed to deactive user. Please try again.");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user. Please try again.");
    }
  };
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
                <Typography variant="body1">{`Full Name: ${user.fullName}`}</Typography>
                <Typography variant="body1">{`Address: ${user.address || "N/A"}`}</Typography>
                <Typography variant="body1">{`Age: ${user.age || "N/A"}`}</Typography>
                <Typography variant="body1">{`Gender: ${user.gender || "N/A"}`}</Typography>
                <Typography variant="body1">{`Role: ${getRoleName(user.roleId)}`}</Typography>
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <Typography variant="body1">{`Active: ${user.isActive ? "Yes" : "No"}`}</Typography>
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
              {user.isActive ? (
                <Button variant="contained" color="secondary" disabled>
                  Activate
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleActivate}>
                  Activate
                </Button>
              )}
              {user.isActive ? (
                <Button variant="contained" color="primary" onClick={handleDeactivate}>
                  Deactivate
                </Button>
              ) : (
                <Button variant="contained" color="secondary" disabled>
                  Deactivate
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

UserDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UserDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { userId } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      return {
        props: { user },
      };
    } else {
      return {
        props: { user: null },
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: { user: null },
    };
  }
};
