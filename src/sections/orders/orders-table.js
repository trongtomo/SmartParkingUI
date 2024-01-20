import PropTypes from "prop-types";
import moment from "moment";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "blue";
    case "pending":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "black"; // Set a default color if needed
  }
};
export const OrdersTable = (props) => {
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
                <TableCell>Parking Order ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Bike Plate Number</TableCell>
                <TableCell>Parking Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expired Date</TableCell>
                <TableCell>Created At</TableCell>
                {/* <TableCell>Updated At</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => {
                const expiredDate = order.expiredDate
                  ? moment(order.expiredDate).format("DD/MM/YYYY")
                  : "";
                const createdAt = order.createdAt
                  ? moment(order.createdAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const updatedAt = order.updatedAt
                  ? moment(order.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                return (
                  <TableRow hover key={order.parkingOrderId}>
                    <TableCell>
                      <Button href={`/orders/${order.parkingOrderId}`}>
                        {order.parkingOrderId}
                      </Button>
                    </TableCell>
                    <TableCell>{order.parkingOrderAmount} VND</TableCell>
                    <TableCell>{order.description || "N/A"}</TableCell>
                    {/* <TableCell>{order.bikeId}</TableCell>
                    <TableCell>{order.parkingType}</TableCell> */}

                    <TableCell>
                      <Button href={`/bikes/${order.bikeId}`}>{order.plateNumber}</Button>
                    </TableCell>
                    <TableCell>{order.parkingType}</TableCell>
                    <TableCell style={{ color: getStatusColor(order.parkingOrderStatus) }}>
                      {order.parkingOrderStatus}
                    </TableCell>
                    <TableCell>{expiredDate}</TableCell>
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

OrdersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
