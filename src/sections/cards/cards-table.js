// src/sections/cards/cards-table.js
"use client";
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
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useAuthContext } from "src/contexts/auth-context";
import axios from "axios";
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
  const auth = useAuthContext();
  const token = auth.user?.accessToken;
  useEffect(() => {
    // Check if any card in the items array has an expiredDate
    const isAnyCardWithInactive = items.some(
      (card) => card.status === "inactive" && card.plateNumber !== "N/A"
    );
    setRevokeButtonDisabled(!isAnyCardWithInactive);
  }, [items]);

  const handleRevokeAction = async (card) => {
    try {
      // Make an API request to revoke the card by plate number
      const response = await axios.post(
        `${apiUrl}/api/admin/cards/revoke?plateNumber=${card.plateNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // If the API request is successful, you can handle any additional actions or updates here
        console.log(`Card revoked successfully for plate number: ${card.plateNumber}`);
        // You might want to refetch data or update the local state
      } else {
        // Handle the case where the API request was not successful
        console.error(`Failed to revoke card for plate number: ${card.plateNumber}`);
      }
    } catch (error) {
      // Handle errors that may occur during the API request
      console.error("Error revoking card:", error);
    }
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
                    <TableCell>{card.cardId}</TableCell>
                    <TableCell>{card.startDate}</TableCell>
                    <TableCell>{card.expiredDate ? card.expiredDate : "N/A"}</TableCell>
                    <TableCell>{card.status}</TableCell>
                    <TableCell>{card.plateNumber ? card.plateNumber : "N/A"}</TableCell>
                    <TableCell>{parkingTypeLabel}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={revokeButtonDisabled || card.status !== "inactive"}
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
