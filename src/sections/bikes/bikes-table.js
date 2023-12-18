// src/sections/bikes/bikes-table.js
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
export const BikesTable = (props) => {
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
                <TableCell>Bike ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Plate Number</TableCell>
                <TableCell>Manufacture</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((bike) => (
                <TableRow hover key={bike.bikeId}>
                  <TableCell>
                    {" "}
                    <Link href={`/bikes/${bike.bikeId}`}>{bike.bikeId}</Link>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Link href={`/users/${bike.userId}`}>{bike.userId}</Link>
                  </TableCell>
                  <TableCell>{bike.model}</TableCell>
                  <TableCell>{bike.plateNumber}</TableCell>
                  <TableCell>{bike.manufacture}</TableCell>
                  <TableCell>{bike.status}</TableCell>
                  <TableCell>{moment(bike.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                  <TableCell>{moment(bike.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
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

BikesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
