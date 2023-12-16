// src/sections/cards/cards-table.js
import PropTypes from "prop-types";
import moment from "moment";
import { useState, useEffect } from "react";
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
  const [revokeButtonDisabled, setRevokeButtonDisabled] = useState(true);
  useEffect(() => {
    // Check if any card in the items array has an expiredDate
    const isAnyCardWithExpiredDate = items.some(
      (card) => card.expiredDate !== null || card.expiredDate !== "N/A"
    );
    setRevokeButtonDisabled(!isAnyCardWithExpiredDate);
  }, [items]);
  const handleRevokeAction = (card) => {
    // Implement the logic to handle the revoke action here
    console.log(`Revoke action for card ID ${card.cardId}`);
  };
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
              {items.map((card) => {
                const parkingTypeLabel =
                  card.parkingTypeId === 1
                    ? "Guest"
                    : card.parkingTypeId === 2
                    ? "Resident"
                    : "N/A";
                return (
                  <TableRow hover key={card.cardId}>
                    <TableCell>
                      <Link href={`/cards/${card.cardId}`}>{card.cardId}</Link>
                    </TableCell>
                    <TableCell>{card.startDate}</TableCell>
                    <TableCell>{card.expiredDate ? card.expiredDate : "N/A"}</TableCell>
                    <TableCell>{card.status}</TableCell>
                    <TableCell>{card.plateNumber ? card.plateNumber : "N/A"}</TableCell>
                    <TableCell>{parkingTypeLabel}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={card.expiredDate === null || card.expiredDate === "N/A"}
                        onClick={() => handleRevokeAction(card)}
                      >
                        Revoke
                      </Button>
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
