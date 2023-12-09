import PropTypes from "prop-types";
import moment from "moment"; // Import moment
import {
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import axios from "axios";
import Link from "next/link";
export const RegistrationsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const apiUrl = `http://localhost:3000`;
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MiwidXNlcm5hbWUiOiIwOTA2NjExNDEzIiwiY3JlYXRlZEF0IjoiMjAyMy0xMi0wOFQyMjo0MToxOS41OTFaIn0sImlhdCI6MTcwMjA3NTI3OX0.DSuDkWS64sbkrBlrReEI2e8hJud5HwoGN7nGEnxqmIo";
  const handleDisable = async (registrationId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/admin/registrations/disable/${registrationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      console.log("Registration disabled:", response.data);
    } catch (error) {
      console.error("Error disabling registration:", error.response?.data || error.message);
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Registration ID</TableCell>
                <TableCell>User's phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Expired Date</TableCell>
                <TableCell>Plate Number</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((registration) => {
                const expiredDate = registration.expiredDate
                  ? moment(registration.expiredDate).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const createdAt = registration.createdAt
                  ? moment(registration.createdAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const updatedAt = registration.updatedAt
                  ? moment(registration.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                return (
                  <TableRow hover key={registration.registrationId}>
                    <TableCell>
                      <Link href={`/registrations/${registration.registrationId}`}>
                        {registration.registrationId}
                      </Link>
                    </TableCell>
                    <TableCell>{registration.username}</TableCell>
                    <TableCell>{registration.registrationStatus}</TableCell>
                    <TableCell>{registration.approvedBy}</TableCell>
                    <TableCell>{expiredDate}</TableCell>
                    <TableCell>{registration.plateNumber}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`/registrations/${registration.registrationId}`}
                        >
                          Details
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDisable(registration.registrationId)}
                        >
                          Disable
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

RegistrationsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
