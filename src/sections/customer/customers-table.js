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
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;
  const handleVerify = async (registrationId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/registrations/${registrationId}`,
        {
          // Additional data to include in the request body if needed
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6NCwidXNlcm5hbWUiOiIwOTA2NjExNDEyIiwiY3JlYXRlZEF0IjoiMjAyMy0xMS0yOVQwMToyMDo0NS4xMjRaIn0sImlhdCI6MTcwMTIyMDg0NX0.ojYyZABijQYbN4Mgkfy8gzUYM8xxzsjPj77hLTP0MfA`,
          },
        }
      );

      // Handle the response as needed
      console.log("Verification response:", response.data);
    } catch (error) {
      console.error("Error verifying registration:", error);
    }
  };

  const handleDisable = async (registrationId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/registrations/disable/${registrationId}`,
        {
          // Additional data to include in the request body if needed
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6NCwidXNlcm5hbWUiOiIwOTA2NjExNDEyIiwiY3JlYXRlZEF0IjoiMjAyMy0xMS0yOVQwMToyMDo0NS4xMjRaIn0sImlhdCI6MTcwMTIyMDg0NX0.ojYyZABijQYbN4Mgkfy8gzUYM8xxzsjPj77hLTP0MfA`,
          },
        }
      );

      // Handle the response as needed
      console.log("Disable response:", response.data);
    } catch (error) {
      console.error("Error disabling registration:", error);
    }
  };
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Registration ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Expired Date</TableCell>
                <TableCell>Face Image</TableCell>
                {/* ... (Add other properties) */}
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((registration) => {
                const isSelected = selected.includes(registration.registrationId);
                const createdAt = registration.createdAt
                  ? moment(registration.createdAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const updatedAt = registration.updatedAt
                  ? moment(registration.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";

                return (
                  <TableRow hover key={registration.registrationId} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(registration.registrationId);
                          } else {
                            onDeselectOne?.(registration.registrationId);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVerify(registration.registrationId)}
                      >
                        Verify
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDisable(registration.registrationId)}
                      >
                        Disable
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Link href={`/registrations/${registration.registrationId}`}>
                        {registration.registrationId}
                      </Link>
                    </TableCell>
                    <TableCell>{registration.registrationStatus}</TableCell>
                    <TableCell>{registration.amount}</TableCell>
                    <TableCell>{registration.approvedBy}</TableCell>
                    <TableCell>{registration.expiredDate}</TableCell>
                    <TableCell>{registration.faceImage}</TableCell>
                    {/* ... (Add other cells) */}
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
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
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
