"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Paper, Card } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthContext } from "src/contexts/auth-context";
import Image from "next/image";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SessionDetailPage = () => {
  const [session, setSessionData] = useState({});
  const router = useRouter();
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const sessionId = router.query?.sessionId;

  useEffect(() => {
    const getParkingSession = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const session = response.data.data.parkingSession;
        setSessionData(session);
      } catch (err) {
        console.error("ERR", err);
      }
    };

    getParkingSession();
  }, []);

  const renderDateTime = (dateTime, label) => (
    <Typography variant="body1">
      {`${label}: ${dateTime ? moment(dateTime).format("YYYY-MM-DD HH:mm:ss") : "parking"}`}
    </Typography>
  );

  const renderCardInfo = (cardId, label) => (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="body1" color="secondary">{`${label}: ${
        cardId || "parking"
      }`}</Typography>
      {label === "Check-in Time" && renderDateTime(session.checkinTime)}
      {label === "Check-out Time" && renderDateTime(session.checkoutTime)}
    </Paper>
  );

  const renderParkingType = () => (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="body1">{`Parking Type: ${session.parkingTypeGroup}`}</Typography>
    </Paper>
  );

  const renderParkingFee = () => (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="body1">
        {`Parking Fee: ${session.parkingFee || "parking"}`} VND
      </Typography>
    </Paper>
  );

  const renderImages = (faceImage, plateNumberImage, altText) => (
    <>
      <Typography variant="h6" sx={{ color: "#1976D2" }}>
        {altText}
      </Typography>
      {!faceImage && !plateNumberImage ? (
        <Typography variant="body2">{`${altText}: parking`}</Typography>
      ) : (
        <>
          {faceImage && renderImage(faceImage, `${altText} Face Image`)}
          {plateNumberImage && renderImage(plateNumberImage, `${altText} Plate Number Image`)}
        </>
      )}
    </>
  );

  const renderImage = (imageData, altText) => (
    <Image src={`data:image/png;base64, ${imageData}`} alt={altText} width={300} height={300} />
  );

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
            <Typography variant="h4" sx={{ color: "#d32f2f" }}>
              Session Not Found
            </Typography>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
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
              <Button onClick={() => router.back()} variant="contained" sx={{ color: "white" }}>
                Back
              </Button>
              <Typography
                variant="h4"
                sx={{ color: "#1976D2" }}
              >{`Session #${session.parkingSessionId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Check-in Images */}
              <Grid item xs={12} md={6} lg={6}>
                {renderImages(
                  session.checkinFaceImage,
                  session.checkinPlateNumberImage,
                  "Check-In"
                )}
              </Grid>

              {/* Session Details */}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: 4,
                    padding: 3,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      {renderCardInfo(session.checkinCardId, "Checkin card ID")}
                      {renderCardInfo(session.checkoutCardId, "Checkout card ID")}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper elevation={3} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                        <Typography variant="body1">{`Approved By: ${session.approvedBy}`}</Typography>
                        <Typography variant="body1">{`Plate Number: ${session.plateNumber}`}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      {renderParkingType()}
                    </Grid>
                    <Grid item xs={12}>
                      {renderParkingFee()}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Check-out Images */}
              <Grid item xs={12} md={6} lg={6}>
                {renderImages(
                  session.checkoutFaceImage,
                  session.checkoutPlateNumberImage,
                  "Check-Out"
                )}
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
