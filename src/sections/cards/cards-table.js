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
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Bike Plate number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((card) => (
                <TableRow hover key={card.cardId}>
                  <TableCell>
                    <Button href={`/cards/${card.cardId}`}>{card.cardId}</Button>
                  </TableCell>
                  <TableCell>{card.status}</TableCell>
                  <TableCell>{card.createdAt}</TableCell>
                  <TableCell>{card.updatedAt || "N/A"}</TableCell>
                  <TableCell>
                    {card.bikeId ? (
                      <Button href={`/bikes/${card.bikeId}`}>{card.plateNumber}</Button>
                    ) : (
                      <span>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onRevoke(card.cardId)}
                        style={{ marginRight: 6 }}
                        disabled={card.status === "assigned" ? false : true}
                      >
                        Revoke
                      </Button>
                      <Button
                        variant="contained"
                        color="info"
                        href={`/cards/${card.cardId}`}
                        style={{ marginRight: 6 }}
                      >
                        View logs
                      </Button>
                    </Box>
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
