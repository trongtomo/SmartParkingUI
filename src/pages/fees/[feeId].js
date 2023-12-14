import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Box, Container, Stack, Typography, Button, TextField } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import moment from "moment";
import { toast } from "react-toastify";

const apiUrl = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6OCwidXNlcm5hbWUiOiIwOTA1NTQ3ODkwIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0xMVQxMTozMDowNi4yMzRaIn0sImlhdCI6MTcwMjI5NDIwNn0.lE8-J7-qlDNQcXmqEVhTdOZ5jylF9BDEI1Ow0rBBdn8";

const FeeDetailsPage = ({ fee }) => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedFee, setUpdatedFee] = useState({});
  const [originalFee, setOriginalFee] = useState({});
  useEffect(() => {
    // Initialize the updated fee object with the current fee details
    setUpdatedFee({
      feeName: fee.feeName || "",
      amount: fee.amount || "",
      description: fee.description || "",
      createdAt: fee.createdAt || "",
      updatedAt: fee.updatedAt || "",
    });
    setOriginalFee({
      feeName: fee.feeName || "",
      amount: fee.amount || "",
      description: fee.description || "",
      createdAt: fee.createdAt || "",
      updatedAt: fee.updatedAt || "",
    });
  }, [fee]);

  const handleUpdate = async () => {
    try {
      // Make a PUT request to update the fee
      const response = await axios.put(
        `${apiUrl}/api/admin/fees/${fee.feeId}`,
        {
          feeName: updatedFee.feeName,
          amount: updatedFee.amount,
          description: updatedFee.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.data && response.data.data.fee) {
        toast.success("Fee updated successfully!");
        setUpdatedFee(response.data.data.fee);
        setIsEditMode(false); // Disable edit mode after successful update
      } else {
        console.error("Failed to update fee:", response.data.message);
        toast.error("Failed to update fee. Please try again.");
      }
    } catch (error) {
      console.error("Error updating fee:", error);
      toast.error("Error updating fee. Please try again.");
    }
  };
  const handleDelete = async () => {
    try {
      // Make a DELETE request to delete the fee
      const response = await axios.delete(`${apiUrl}/api/admin/fees/${fee.feeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Fee deleted successfully!");
        // Redirect to the fee list page or any other appropriate page
        router.push("/fees");
      } else {
        console.error("Failed to delete fee:", response.data.message);
        toast.error("Failed to delete fee. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting fee:", error);
      toast.error("Error deleting fee. Something Wrong.");
    }
  };
  const handleCancel = () => {
    // Reset the updated fee to the original fee details
    setUpdatedFee(updatedFee.feeId ? updatedFee : originalFee);

    // Disable edit mode
    setIsEditMode(false);
  };
  return (
    <>
      <Head>
        <title>{`Fee: ${fee.feeName} | Your App Name`}</title>
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
              <Typography variant="h4">{`Fee: ${fee.feeName}`}</Typography>
            </Stack>

            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
                padding: 3,
              }}
            >
              {/* Editable form fields */}
              <TextField
                margin="dense"
                label="Fee Name"
                type="text"
                fullWidth
                value={updatedFee.feeName}
                onChange={(e) => setUpdatedFee((prev) => ({ ...prev, feeName: e.target.value }))}
                disabled={!isEditMode}
              />
              <TextField
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                value={updatedFee.amount}
                onChange={(e) => setUpdatedFee((prev) => ({ ...prev, amount: e.target.value }))}
                disabled={!isEditMode}
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                value={updatedFee.description}
                onChange={(e) =>
                  setUpdatedFee((prev) => ({ ...prev, description: e.target.value }))
                }
                disabled={!isEditMode}
              />
            </Box>
            {/* Display non-editable fields */}
            <Typography variant="body1">{`Created At: ${moment(updatedFee.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            )}`}</Typography>
            <Typography variant="body1">{`Updated At: ${moment(updatedFee.updatedAt).format(
              "YYYY-MM-DD HH:mm:ss"
            )}`}</Typography>
            {/* Update,Delete and Cancel Buttons */}
            {isEditMode ? (
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Update
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={() => setIsEditMode(true)}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

FeeDetailsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export const getServerSideProps = async ({ params }) => {
  const { feeId } = params;

  try {
    const response = await axios.get(`${apiUrl}/api/admin/fees/${feeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.data && response.data.data.fee) {
      const fee = response.data.data.fee;
      return {
        props: { fee },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch (error) {
    console.error("Error fetching fee data:", error);
    return {
      props: {},
    };
  }
};

export default FeeDetailsPage;
