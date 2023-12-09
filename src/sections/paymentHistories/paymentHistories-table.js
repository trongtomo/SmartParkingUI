// src/sections/paymentHistories/paymentHistories-table.js
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

export const PaymentHistoriesTable = (props) => {
  const {
    histories = [],
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
                <TableCell>Payment History ID</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Event Time</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Payment ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {histories.map((history) => {
                return (
                  <TableRow hover key={history.paymentHistoryId}>
                    <TableCell>
                      <Link href={`/paymentHistories/${history.paymentHistoryId}`}>
                        {history.paymentHistoryId}
                      </Link>
                    </TableCell>
                    <TableCell>{history.eventType}</TableCell>
                    <TableCell>{history.eventTime}</TableCell>
                    <TableCell>{history.details}</TableCell>
                    <TableCell>{history.status}</TableCell>
                    <TableCell>{history.createdAt}</TableCell>
                    <TableCell>{history.updatedAt}</TableCell>
                    <TableCell>{history.paymentId}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`/paymentHistories/${history.paymentHistoryId}`}
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

PaymentHistoriesTable.propTypes = {
  histories: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
