// src/sections/cards/cards-table.js
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

export const CardsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onDeactivate,
    onActivate,
    onRevoke,
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
                <TableCell>Bike Plate number</TableCell>
                <TableCell>Parking Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((card) => (
                <TableRow hover key={card.cardId}>
                  <TableCell>{card.cardId}</TableCell>
                  <TableCell>{card.startDate}</TableCell>
                  <TableCell>{card.expiredDate || "N/A"}</TableCell>
                  <TableCell>{card.status}</TableCell>
                  <TableCell>{card.plateNumber || "N/A"}</TableCell>
                  <TableCell>
                    {card.parkingTypeId === 1
                      ? "Guest"
                      : card.parkingTypeId === 2
                      ? "Resident"
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {card.status === "inactive" ? (
                      <Button variant="contained" color="primary" onClick={() => onActivate(card)}>
                        Activate
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onDeactivate(card)}
                      >
                        Deactivate
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onRevoke(card.plateNumber)}
                      disabled={card.status === "assigned" ? false : true}
                    >
                      Revoke
                    </Button>
                  </TableCell>
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

CardsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onDeactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onRevoke: PropTypes.func,
};
