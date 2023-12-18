import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/contexts/auth-context";
import moment from "moment";

export const TotalCheckout = (props) => {
  const { difference, positive = false, sx, value } = props;

  const [totalCustomers, setTotalCustomers] = useState();

  const auth = useAuthContext();
  const token = auth.user.accessToken;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = moment().toISOString();
        const startDate = moment(endDate).subtract(7, "days").toISOString();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckout?parkingTypeName=guest&dateStart=${startDate}&dateEnd=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setTotalCustomers(response.data.data);
        } else {
          // Handle error if needed
          console.error("Failed to fetch total customers:", response.data);
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error fetching total customers:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Guest Checkout in 7 days
            </Typography>
            <Typography variant="h4">
              {totalCustomers !== null ? totalCustomers : "Loading..."}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

TotalCheckout.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
