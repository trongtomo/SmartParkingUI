// Import necessary modules
import PropTypes from "prop-types";
import moment from "moment";
import {
  Box,
  Card,
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

// Define the ParkingSessionsTable component
export const ParkingSessionsTable = (props) => {
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
                <TableCell>Parking Session ID</TableCell>
                <TableCell>Checkin Card ID</TableCell>
                <TableCell>Check-in Time</TableCell>
                <TableCell>Check-out Card ID</TableCell>
                <TableCell>Check-out Time</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Plate Number</TableCell>
                <TableCell>Parking Fee</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((session) => {
                const checkinTime = session.checkinTime
                  ? moment(session.checkinTime).format("DD/MM/YYYY HH:mm:ss")
                  : "N/A";
                const checkoutTime = moment(session.checkoutTime).isValid()
                  ? moment(session.checkoutTime).format("DD/MM/YYYY HH:mm:ss")
                  : "N/A";
                // const createdAt = session.createdAt
                // ? moment(session.createdAt).format("DD/MM/YYYY HH:mm:ss")
                // : "N/A";
                const updatedAt = session.updatedAt
                  ? moment(session.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "N/A";
                return (
                  <TableRow hover key={session.parkingSessionId}>
                    <TableCell>
                      <Link href={`/parkingSessions/${session.parkingSessionId}`}>
                        {session.parkingSessionId}
                      </Link>
                    </TableCell>
                    <TableCell>{session.checkinCardId ? session.checkinCardId : "N/A"}</TableCell>
                    <TableCell>{checkinTime ? checkinTime : "N/A"}</TableCell>
                    <TableCell>{session.checkoutCardId ? session.checkoutCardId : "N/A"}</TableCell>
                    <TableCell>{checkoutTime ? checkoutTime : "N/A"}</TableCell>
                    <TableCell>{session.approvedBy}</TableCell>
                    <TableCell>{session.plateNumber}</TableCell>
                    <TableCell>{session.parkingFee}</TableCell>
                    {/* <TableCell>{createdAt}</TableCell> */}
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`/parkingSessions/${session.parkingSessionId}`}
                        >
                          Details
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

// Define the PropTypes for the component
ParkingSessionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
