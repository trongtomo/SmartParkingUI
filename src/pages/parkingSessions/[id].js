import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";
const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNFQxNzoxMDoxMS43NjBaIn0sImlhdCI6MTcwMjU3MzgxMX0.HrFRgoBb_HHBWsKYaXf6h0wGtFbLRDr1i_S4WJVnv2Y";

const SessionDetailPage = ({ session }) => {
  const router = useRouter();

  if (!session) {
    return (
      <>
        <Head>
          <title>Session Not Found | Smart-Parking</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4">Session Not Found</Typography>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <div>
          <button onClick={() => router.back()}>Back</button>
        </div>
        <title>{`Session #${session.parkingSessionId} | Smart-Parking`}</title>
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => router.back()}>Back</Button>
              <Typography variant="h4">{`Session #${session.parkingSessionId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Check-in Images */}
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="h6">Check-In</Typography>
                {[session.checkinFaceImage, session.checkinPlateNumberImage].map((image, index) => (
                  <Image
                    key={index}
                    src={`data:image/png;base64, ${image}`}
                    alt={`Check-In Image ${index + 1}`}
                    width={400}
                    height={600}
                  />
                ))}
              </Grid>

              {/* Check-out Images */}
              <Grid item xs={12} md={6} lg={4}>
                <Typography variant="h6">Check-Out</Typography>
                {[session.checkoutFaceImage, session.checkoutPlateNumberImage].map(
                  (image, index) => (
                    <Image
                      key={index}
                      src={`data:image/png;base64, ${image}`}
                      alt={`Check-Out Image ${index + 1}`}
                      width={400}
                      height={600}
                    />
                  )
                )}
              </Grid>

              {/* Session Details */}
              <Grid item xs={12} md={12} lg={12}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: 4,
                    padding: 3,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body1">{`Card ID: ${session.cardId}`}</Typography>
                    <Typography variant="body1">{`Check-in Time: ${moment(
                      session.checkinTime
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Check-out Time: ${moment(
                      session.checkoutTime
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Approved By: ${session.approvedBy}`}</Typography>
                    <Typography variant="body1">{`Plate Number: ${session.plateNumber}`}</Typography>
                    <Typography variant="body1">{`Parking Fee: ${session.parkingFee}`}</Typography>
                    <Typography variant="body1">{`Created At: ${moment(session.createdAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}`}</Typography>
                    <Typography variant="body1">{`Updated At: ${moment(session.updatedAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}`}</Typography>

                    {/* Display Parking Type ID or Name */}
                    <Typography variant="body1">
                      {`Parking Type: ${
                        session.ParkingType?.parkingTypeId || session.parkingTypeId
                      }`}
                    </Typography>

                    {/* Additional details from ParkingType if needed */}
                    <Typography variant="body1">{`Parking Type Description: ${
                      session.ParkingType?.description || "N/A"
                    }`}</Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

SessionDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SessionDetailPage;

export const getServerSideProps = async ({ params }) => {
  const { id } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.parkingSession) {
      const session = response.data.data.parkingSession;
      return {
        props: { session },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    return {
      props: {},
    };
  }
};
