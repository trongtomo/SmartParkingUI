import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Button, Container, Stack, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import moment from "moment";
import { useAuthContext } from "src/contexts/auth-context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const apiUrl = "https://smart-parking-server-dev.azurewebsites.net";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xNVQwMTowODo1MS4zMjZaIn0sImlhdCI6MTcwMjYwMjUzMX0.5QLM-Kh-HKgxR79v0cYRhntZC0DGYFlZt9UspIDWk9I";
const handleDisable = async (registrationId) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/admin/registrations/disable/${registrationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      toast.success("Registration disable successfully!");
      router.replace(router.asPath);
    } else {
      console.error("Failed to disable registration", response.data.message);
    }
  } catch (error) {
    console.error("Error disabling registration:", error.response?.data || error.message);
  }
};

// const handleActivate = async (registrationId) => {
//   try {
//     // Make a request to activate the registration using the selected card

//     const response = await axios.put(
//       `${apiUrl}/api/admin/registrations/activate/${registrationId}`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.data.success) {
//       toast.success("Registration activated successfully!");
//       router.replace(router.asPath);
//     } else {
//       console.error(
//         "Failed to activate registration, regis doesn't have valid payment",
//         response.data.message
//       );
//     }
//   } catch (error) {
//     toast.error("Error activating registration. Please try again.", { autoClose: 3000 });
//     console.error("Error activating registration:", error);
//   }
// };

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
      // Do something on success
      toast.success("Verify success");
      router.replace(router.asPath);
    } else {
      // Handle errors
      toast.error("Can't verify, please try again!");
    }
  } catch (error) {
    console.error("Error verifying registration:", error);
  }
};

const handleReject = async (registrationId) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/admin/registrations/reject/${registrationId}`,
      {}
    );
    if (response.data.success) {
      // Do something on success
      toast.success("Reject success");
      router.replace(router.asPath);
    } else {
      // Handle errors
    }
  } catch (error) {
    console.error("Error rejecting registration:", error);
  }
};
const handleEnable = async (registrationId) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/admin/registrations/enable/${registrationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      toast.success("Registration enable successfully!");
      router.replace(router.asPath);
    } else {
      console.error("Failed to enable registration", response.data.message);
    }
  } catch (error) {
    console.error("Error enabling registration:", error.message);
  }
};

const RegistrationDetailPage = ({ registration, registrationHistories, payments, cards }) => {
  const router = useRouter();
  const [isActivateFormOpen, setIsActivateFormOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const handleActivate = (registrationId) => {
    // Set the selected card to the first card by default
    const defaultCardId =
      cards.data && cards.data.activeCards.length > 0 ? cards.data.activeCards[0].cardId : "";
    setSelectedCardId(defaultCardId);

    // Open the activation form
    setIsActivateFormOpen(true);
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
        <div>
          <button onClick={() => router.back()}>Back</button>
        </div>
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
              <Button onClick={() => router.back()}>Back</Button>
              <Typography variant="h4">{`Registration #${registration.registrationId}`}</Typography>
            </Stack>

            <Grid container spacing={3}>
              {/* Face Image on the left */}
              <Grid item xs={12} md={6} lg={4}>
                {registration.faceImage && (
                  <Image
                    src={`data:image/png;base64, ${registration.faceImage}`}
                    alt={`Face of ${registration.username}`}
                    width={400}
                    height={600}
                  ></Image>
                )}
              </Grid>

              {/* Registration Details on the right */}
              <Grid item xs={12} md={6} lg={8}>
                <Box
                  sx={{
                    backgroundColor: "#f0f0f0", // Set your preferred background color
                    borderRadius: 4,
                    padding: 3,
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="body1">{`Registration Status: ${registration.status}`}</Typography>
                    <Typography variant="body1">{`Approved By: ${registration.approvedBy}`}</Typography>
                    <Typography variant="body1">
                      {`Expired Date: ${
                        registration.expiredDate
                          ? moment(registration.expiredDate).format("YYYY-MM-DD HH:mm:ss")
                          : " "
                      }`}
                    </Typography>
                    <Typography variant="body1">{`Plate Number: ${registration.plateNumber}`}</Typography>
                    <Typography variant="body1">{`Model: ${registration.model}`}</Typography>
                    <Typography variant="body1">{`Registration Number: ${registration.registrationNumber}`}</Typography>
                    <Typography variant="body1">{`Manufacture: ${registration.manufacture}`}</Typography>
                    <Typography variant="body1">{`Gender: ${registration.gender}`}</Typography>
                    <Typography variant="body1">{`User ID: ${registration.userId}`}</Typography>
                    <Typography variant="body1">{`Created At: ${moment(
                      registration.createdAt
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    <Typography variant="body1">{`Updated At: ${moment(
                      registration.updatedAt
                    ).format("YYYY-MM-DD HH:mm:ss")}`}</Typography>
                    {/* Add other details here */}
                    {/* Additional buttons based on registration status */}
                    <Stack spacing={1}>
                      <Button
                        onClick={() => handleActivate(registration.registrationId)}
                        disabled={registration.status !== "paid"}
                      >
                        Activate
                      </Button>

                      <Button
                        onClick={() => handleReject(registration.registrationId)}
                        disabled={
                          registration.status !== "created" &&
                          registration.status !== "verified" &&
                          registration.status !== "paid"
                        }
                      >
                        Reject
                      </Button>

                      <Button
                        onClick={() => handleDisable(registration.registrationId)}
                        disabled={registration.status !== "active"}
                      >
                        Disable
                      </Button>

                      <Button
                        onClick={() => handleVerify(registration.registrationId)}
                        disabled={registration.status !== "created"}
                      >
                        Verify
                      </Button>

                      <Button
                        onClick={() => handleEnable(registration.registrationId)}
                        disabled={registration.status !== "disable"}
                      >
                        Enable
                      </Button>
                    </Stack>

                    {/* Activate Registration Form */}
                    <ActivateRegistrationForm
                      open={isActivateFormOpen}
                      handleClose={() => setIsActivateFormOpen(false)}
                      handleActivate={handleActivate}
                      cards={cards}
                      selectedCardId={selectedCardId}
                      setSelectedCardId={setSelectedCardId}
                      registrationId={registration.registrationId}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* New section for Registration History */}
            <Stack>
              <Typography variant="h5">Registration History</Typography>
              <Grid container spacing={2}>
                {registrationHistories.map((history) => (
                  <Grid item key={history.registrationHistoryId} xs={12}>
                    <Box
                      sx={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 4,
                        padding: 2,
                      }}
                    >
                      <Typography variant="body1">{`Status: ${history.status}`}</Typography>
                      <Typography variant="body1">
                        {`Approved By: ${history.approvedBy}`}
                      </Typography>
                      <Typography variant="body1">
                        {`Created At: ${moment(history.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
                      </Typography>
                      {/* Add other details from the history if needed */}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
            {/* New section for Payment Information */}
            <PaymentInfo payments={payments} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

RegistrationDetailPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const ActivateRegistrationForm = ({ open, handleClose, handleActivate, cards, registrationId }) => {
  const [selectedCardId, setSelectedCardId] = useState("");

  const handleActivateClick = async () => {
    // Validate the form fields, perform additional checks if needed
    console.log(selectedCardId);
    if (selectedCardId) {
      try {
        // Make a request to activate the registration using the selected card
        const response = await axios.put(
          `${apiUrl}/api/admin/registrations/active/${registrationId}`,
          {
            cardId: selectedCardId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Call handleActivate to perform additional logic
          handleActivate(registrationId);
          toast.success("Registration activated successfully!");
        } else {
          console.error("Failed to activate registration", response.data.message);
        }
      } catch (error) {
        toast.error("Error activating registration. Please try again.", { autoClose: 3000 });
        console.error("Error activating registration:", error);
      }

      handleClose();
    } else {
      // Display an error or handle invalid form data
      console.error("Invalid form data");
      toast.error("Please select a card to activate the registration.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Activate Registration</DialogTitle>
      <DialogContent>
        <DialogContentText>Select a card to activate the registration:</DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="cardId-label">Select Card</InputLabel>
          <Select
            labelId="cardId-label"
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            required
          >
            {cards.activeCards ? (
              cards.activeCards.map((card) => (
                <MenuItem key={card.cardId} value={card.cardId}>
                  {card.cardId}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No cards available</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleActivateClick} color="primary">
          Activate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const PaymentInfo = ({ payments }) => {
  return (
    <Stack>
      <Typography variant="h5">Payment Information</Typography>
      <Grid container spacing={2}>
        {payments.map((payment) => (
          <Grid item key={payment.paymentId} xs={12}>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                padding: 2,
              }}
            >
              <Typography variant="body1">{`Amount: ${payment.amount}`}</Typography>
              <Typography variant="body1">{`Payment Method: ${payment.paymentMethod}`}</Typography>
              <Typography variant="body1">{`Status: ${payment.status}`}</Typography>
              <Typography variant="body1">{`Created At: ${moment(payment.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}`}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { registrationId } = params;

  try {
    const [registrationResponse, historyResponse, paymentResponse, cardResponse] =
      await Promise.all([
        axios.get(`${apiUrl}/api/admin/registrations/${registrationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${apiUrl}/api/admin/registrations/history/${registrationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${apiUrl}/api/admin/registrations/payment/${registrationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${apiUrl}/api/admin/active-cards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

    if (
      registrationResponse.data.success &&
      registrationResponse.data.data &&
      registrationResponse.data.data.registration
    ) {
      const registration = registrationResponse.data.data.registration;

      // Extract registrationHistories from the second response
      const registrationHistories =
        historyResponse.data.success && historyResponse.data.data
          ? historyResponse.data.data.registrationHistories
          : [];
      // Third response
      const payments =
        paymentResponse.data.success && paymentResponse.data.data ? paymentResponse.data.data : [];
      // Fourth
      const cards =
        cardResponse.data.success && cardResponse.data.data ? cardResponse.data.data : [];
      return {
        props: { registration, registrationHistories, payments, cards },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching registration data:", error);
    return {
      props: {},
    };
  }
};
export default RegistrationDetailPage;
