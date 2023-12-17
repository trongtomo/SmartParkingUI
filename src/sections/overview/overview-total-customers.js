import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthContext } from "src/contexts/auth-context";

export const OverviewTotalCustomers = (props) => {
  const { difference, positive = false, sx, value } = props;

  const [totalCustomers, setTotalCustomers] = useState();

  const auth = useAuthContext();
  const token = auth.user.accessToken;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date(); // current date
        const endDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getTotalCheckin?parkingTypeName=resident&${startDate}&${endDate}`,
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
              Total Checkin in 7days
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
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography color={positive ? "success.main" : "error.main"} variant="body2">
                {difference}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTotalCustomers.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};
