// components/sections/users/users-table.js
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

import { useRouter } from "next/router";
export const UsersTable = (props) => {
  const router = useRouter();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "Security";
      case 3:
        return "User";
      default:
        return "Unknown";
    }
  };
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                return (
                  <TableRow hover key={user.userId}>
                    <TableCell>
                      <Button href={`/users/${user.userId}`}>{user.userId}</Button>
                    </TableCell>
                    <TableCell>{user.userFullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell style={{ color: user.userStatus === "active" ? "blue" : "red" }}>
                      {user.userStatus}
                    </TableCell>
                    <TableCell>{moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>{moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>{getRoleName(user.roleId)}</TableCell>
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

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
