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
import Link from "next/link";
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((user) => {
                return (
                  <TableRow hover key={user.userId}>
                    <TableCell>
                      <Link href={`/users/${user.userId}`}>{user.userId}</Link>
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>
                    <TableCell>{moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>{moment(user.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                    <TableCell>{getRoleName(user.roleId)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {/* Add other action buttons */}
                        <Button variant="contained" color="primary" onClick={() => {
                          router.push(`/users/${user.userId}`)
                      
                        }}>
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

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
