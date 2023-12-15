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
                <TableCell>Current Status</TableCell>
                <TableCell>Bike ID</TableCell>
                <TableCell>Parking Type ID</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((card) => {
                const startDate = card.startDate
                  ? moment(card.startDate).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const expiredDate = card.expiredDate
                  ? moment(card.expiredDate).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const createdAt = card.createdAt
                  ? moment(card.createdAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";
                const updatedAt = card.updatedAt
                  ? moment(card.updatedAt).format("DD/MM/YYYY HH:mm:ss")
                  : "";

                return (
                  <TableRow hover key={card.cardId}>
                    <TableCell>
                      <Link href={`/cards/${card.cardId}`}>
                        {card.cardId}
                      </Link>
                    </TableCell>
                    <TableCell>{startDate}</TableCell>
                    <TableCell>{expiredDate}</TableCell>
                    <TableCell>{card.currentStatus}</TableCell>
                    <TableCell>{card.bikeId}</TableCell>
                    <TableCell>{card.parkingTypeId}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{updatedAt}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`/cards/${card.cardId}`}
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

CardsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
