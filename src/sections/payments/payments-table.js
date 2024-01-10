// src/sections/payments/payments-table.js
import PropTypes from "prop-types";
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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import moment from "moment";
import Link from "next/link";
export const PaymentsTable = (props) => {
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
                <TableCell>Payment ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((payment) => (
                <TableRow hover key={payment.paymentId}>
                  <TableCell>
                    <Link href={`/registrations/${payment.registrationId}`}>
                      {payment.registrationId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/payments/${payment.paymentId}`}>{payment.paymentId}</Link>
                  </TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell>{moment(payment.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                </TableRow>
              ))}
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

PaymentsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
