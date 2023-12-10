import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";

const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOVQyMjoyNjowMy45OThaIn0sImlhdCI6MTcwMjE2MDc2NH0.QebBFmf9EILaR4NTROeffE8ZVNrmOTTn61j3BO92rw4";

const UserDetailPage = ({ user }) => {
  return (
    <>
      <Head>
        <title>{`User #${user.userId} | Smart-Parking`}</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">{`User #${user.userId}`}</Typography>
            </div>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={4}>
                  <Typography variant="body1">{`Full Name: ${user.fullName}`}</Typography>
                  <Typography variant="body1">{`Username: ${user.username}`}</Typography>
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                  <Typography variant="body1">{`Active: ${
                    user.isActive ? "Yes" : "No"
                  }`}</Typography>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

UserDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UserDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { id } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/users/${id}`, {
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
