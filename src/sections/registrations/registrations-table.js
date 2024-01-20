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

import Link from "next/link";
const getRegistrationStatusColor = (status) => {
  switch (status) {
    case "verified":
      return "blue";
    case "pending":
      return "green";
    case "rejected":
      return "red";
    default:
      return "black"; // Set a default color if needed
  }
};
export const RegistrationsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Registration ID</TableCell>
                <TableCell>Users phone</TableCell>
                <TableCell>Plate Number</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                {/* <TableCell>Updated At</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((registration) => {
                const createdAt = registration.createdAt
                  ? moment(registration.createdAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const updatedAt = registration.updatedAt
                  ? moment(registration.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                return (
                  <TableRow hover key={registration.registrationId}>
                    <TableCell>
                      <Button href={`/registrations/${registration.registrationId}`}>
                        {registration.registrationId}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button href={`/users/${registration.userId}`}>
                        {registration.username}
                      </Button>
                    </TableCell>

                    <TableCell>{registration.plateNumber}</TableCell>
                    <TableCell>{registration.approvedBy}</TableCell>
                    <TableCell
                      style={{ color: getRegistrationStatusColor(registration.registrationStatus) }}
                    >
                      {registration.registrationStatus}
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
                    {/* <TableCell>{updatedAt}</TableCell> */}
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
