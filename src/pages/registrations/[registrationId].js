import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Badge,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Image from "next/image";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const RegistrationDetailPage = () => {
  const auth = useAuthContext();
  const token = auth.user?.accessToken;
  const router = useRouter();
  const registrationId = router.query.registrationId;
  const [registration, setRegistrationData] = useState({});
  const [registrationHistories, setRegistrationHistories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationResponse, historyResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/registrations/${registrationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/admin/registrations/history/${registrationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (registrationResponse.data.success) {
          const registration = registrationResponse.data.data.registration;
          const registrationHistories =
            historyResponse.data.success && historyResponse.data.data
              ? historyResponse.data.data.registrationHistories
              : [];

          setRegistrationData(registration);
          setRegistrationHistories(registrationHistories);
        } else {
          console.error("Failed to fetch registration data");
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
        toast.error("Failed to fetch registration details");
      }
    };
    fetchData();
  }, [token]);

  const handleVerify = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/verify/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Verify success");
        router.replace(router.asPath);
      } else {
        toast.error("Can't verify, please try again!");
      }
    } catch (error) {
      console.error("Error verifying registration:", error);
      toast.error("Can't verify, please try again!");
    }
  };

  const handleReject = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/reject/${registrationId}`,
        {}
      );
      if (response.data.success) {
        toast.success("Reject success");
        router.replace(router.asPath);
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      toast.error("Can't Reject, please try again!");
    }
  };

  if (!registration) {
    return (
      <>
        <Head>
          <title>Registration Not Found | Smart-Parking</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4">Registration Not Found</Typography>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Registration #${registration.registrationId} | Smart-Parking`}</title>
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
              <Button onClick={() => router.back()} variant="contained">
                Back
              </Button>
              <Typography variant="h4">{`Registration #${registration.registrationId}`}</Typography>
              {/* Buttons based on registrationStatus */}
              <Stack
                spacing={1}
                direction={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                {registration.registrationStatus === "pending" && (
                  <>
                    <Button
                      onClick={() => handleReject(registration.registrationId)}
                      variant="contained"
                      color="error"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleVerify(registration.registrationId)}
                      variant="contained"
                      color="success"
                    >
                      Verify
                    </Button>
                  </>
                )}
                {registration.registrationStatus === "verified" && (
                  <Typography variant="body1"> {""}</Typography>
                )}
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              {/* Registration Details */}
              <Grid item xs={12} md={6} lg={8}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      {/* Left side */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">{`Registration Status: ${registration.registrationStatus}`}</Typography>
                        <Typography variant="body1">{`Approved By: ${registration.approvedBy}`}</Typography>

                        <Typography variant="body1">{`Plate Number: ${registration.plateNumber}`}</Typography>
                        <Typography variant="body1">{`Model: ${registration.model}`}</Typography>
                        <Typography variant="body1">{`Registration Number: ${registration.registrationNumber}`}</Typography>
                        <Typography variant="body1">{`Manufacturer: ${registration.manufacturer}`}</Typography>
                      </Grid>
                      {/* Right side */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">{`User ID: ${registration.userId}`}</Typography>
                        <Typography variant="body1">{`Created At: ${moment(
                          registration.createdAt
                        ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                        <Typography variant="body1">{`Updated At: ${moment(
                          registration.updatedAt
                        ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                      </Grid>
                    </Grid>

                    {/* New section for Registration History */}
                    <Stack>
                      <Typography variant="h5">Registration History</Typography>
                      {/* List for histories */}
                      <List>
                        {Array.isArray(registrationHistories) &&
                          registrationHistories.map((history) => (
                            <Card key={history.registrationHistoryId} sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="body1">{`Registration Status: ${history.registrationStatus}`}</Typography>
                                <Typography variant="body2">{`Approved By: ${history.approvedBy}`}</Typography>
                                <Typography variant="body2">{`Created At: ${moment(
                                  history.createdAt
                                ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                              </CardContent>
                            </Card>
                          ))}
                      </List>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

RegistrationDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RegistrationDetailPage;
