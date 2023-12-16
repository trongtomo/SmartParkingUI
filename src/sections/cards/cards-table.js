// src/sections/cards/cards-table.js
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

export const CardsTable = (props) => {
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
                <TableCell>Card ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Expired Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Bike ID</TableCell>
                <TableCell>Parking Type ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((card) => {
                const startDate = card.startDate
                  ? moment(card.startDate).format("DD/MM/YYYY ")
                  : "";
                const expiredDate = card.expiredDate
                  ? moment(card.expiredDate).format("DD/MM/YYYY ")
                  : "";

                return (
                  <TableRow hover key={card.cardId}>
                    <TableCell>
                      <Link href={`/cards/${card.cardId}`}>{card.cardId}</Link>
                    </TableCell>
                    <TableCell>{startDate}</TableCell>
                    <TableCell>{expiredDate ? expiredDate : "N/A"}</TableCell>
                    <TableCell>{card.status}</TableCell>
                    <TableCell>{card.bikeId ? card.bikeId : "N/A"}</TableCell>
                    <TableCell>{card.parkingTypeId}</TableCell>
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

CardsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
