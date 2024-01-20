"use client";
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
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const getRegistrationStatusColor = (status) => {
  switch (status) {
    case "verified":
      return "blue";
    case "pending":
      return "green";
    case "canceled": // Replace with the actual status name for cancelled
      return "red";
    case "rejected": 
      return "red";
    default:
      return "inherit";
  }
};

const RegistrationDetailPage = () => {
  const auth = useAuthContext();
  const token = localStorage.accessToken;
  const router = useRouter();
  const registrationId = router.query.registrationId;
  const [registration, setRegistrationData] = useState({});
  const [registrationHistories, setRegistrationHistories] = useState([]);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
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
  useEffect(() => {
   
    fetchData();
  }, [token]);

  const openRejectModal = () => {
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
  };

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
        // Update state to trigger re-render
        setRegistrationData({ ...registration, registrationStatus: "verified" });
        fetchData();
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
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Reject success", 1000);
        // Update state to trigger re-render
        setRegistrationData({ ...registration, registrationStatus: "rejected" });
        setTimeout(() => {
          closeRejectModal();
        }, 1000);
      fetchData();
      } else {
        toast.error("Can't reject, please try again!");
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      toast.error("Can't Reject, please try again!", 1000);
    }
  };

  if (!registration || !registrationHistories) {
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
              <Button onClick={() => router.back()} variant="contained" color="primary">
                Back
              </Button>
              <Typography
                variant="h4"
                color="primary"
              >{`Registration #${registration.registrationId}`}</Typography>

              <Stack
                spacing={1}
                direction={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                {registration.registrationStatus === "pending" && (
                  <>
                    <Dialog open={isRejectModalOpen} onClose={closeRejectModal}>
                      <DialogTitle>Reject Registration</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Reason for Rejection"
                          multiline
                          rows={4}
                          variant="outlined"
                          fullWidth
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeRejectModal} color="primary">
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleReject(registration.registrationId, rejectReason)}
                          variant="contained"
                          color="error"
                        >
                          Reject
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button onClick={openRejectModal} variant="contained" color="error">
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
                  <Typography variant="body1" color="textSecondary">
                    {" "}
                    {""}
                  </Typography>
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
                        <Typography variant="body1" color="textSecondary">
                          Registration Status:{" "}
                          <span
                            style={{
                              color: getRegistrationStatusColor(registration.registrationStatus),
                            }}
                          >
                            {registration.registrationStatus}
                          </span>
                        </Typography>

                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`Approved By: ${registration.approvedBy}`}</Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`Plate Number: ${registration.plateNumber}`}</Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`Model: ${registration.model}`}</Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`Registration Number: ${registration.registrationNumber}`}</Typography>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >{`Manufacturer: ${registration.manufacturer}`}</Typography>
                      </Grid>
                      {/* Right side */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" color="textSecondary">
                          <span style={{ fontWeight: "bold" }}>User ID:</span>{" "}
                          <Link
                            href={`/users/${registration.userId}`}
                            style={{ color: "#0070f3", textDecoration: "underline" }}
                          >
                            {registration.userId}
                          </Link>
                        </Typography>
                        <Typography variant="body1" color="textSecondary">{`Created At: ${moment(
                          registration.createdAt
                        ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                        <Typography variant="body1" color="textSecondary">{`Updated At: ${moment(
                          registration.updatedAt
                        ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                      </Grid>
                    </Grid>

                    {/* New section for Registration History */}
                    <Stack>
                      <Typography variant="h5" color="primary">
                        Registration History
                      </Typography>
                      {/* List for histories */}
                      <List>
                        {Array.isArray(registrationHistories) &&
                          registrationHistories.map((history) => (
                            <Card key={history.registrationHistoryId} sx={{ mb: 2 }}>
                              <CardContent>
                                <Typography variant="body1" color="textSecondary">
                                  Registration Status:{" "}
                                  <span
                                    style={{
                                      color: getRegistrationStatusColor(history.registrationStatus),
                                    }}
                                  >
                                    {history.registrationStatus}
                                  </span>
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >{`Approved By: ${history.approvedBy}`}</Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >{`Created At: ${moment(history.createdAt).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}`}</Typography>
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
