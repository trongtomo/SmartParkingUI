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
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((session) => {
                const checkinTime = session.checkinTime
                  ? moment(session.checkinTime).format("YYYY/MM/DD HH:mm:ss")
                  : "parking";
                const checkoutTime = moment(session.checkoutTime).isValid()
                  ? moment(session.checkoutTime).format("YYYY/MM/DD HH:mm:ss")
                  : "parking";
                // const createdAt = session.createdAt
                // ? moment(session.createdAt).format("YYYY/MM/DD HH:mm:ss")
                // : "parking";
                const updatedAt = session.updatedAt
                  ? moment(session.updatedAt).format("YYYY/MM/DD HH:mm:ss")
                  : "parking";
                return (
                  <TableRow hover key={session.parkingSessionId}>
                    <TableCell>
                      {" "}
                      <Button href={`/parkingSessions/${session.parkingSessionId}`}>
                        {session.parkingSessionId}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {session.checkinCardId ? session.checkinCardId : "parking"}
                    </TableCell>
                    <TableCell>{checkinTime ? checkinTime : "parking"}</TableCell>
                    <TableCell>
                      {session.checkoutCardId ? session.checkoutCardId : "parking"}
                    </TableCell>
                    <TableCell>{checkoutTime ? checkoutTime : "parking"}</TableCell>
                    <TableCell>{session.approvedBy}</TableCell>
                    <TableCell>{session.plateNumber}</TableCell>
                    <TableCell>{session.parkingFee}</TableCell>
                    {/* <TableCell>{createdAt}</TableCell> */}
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

// Define the PropTypes for the component
ParkingSessionsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
