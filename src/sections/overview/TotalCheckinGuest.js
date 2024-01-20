import PropTypes from "prop-types";

import UserIcon from "@heroicons/react/24/solid/UserIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

export const TotalCheckinGuest = (props) => {
  const { handleTotalCheckinGuest, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Guest Checkin
            </Typography>
            <Typography variant="h4">{value !== null ? value : "Loading..."}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UserIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

TotalCheckinGuest.propTypes = {
  handleCheckinValueGuest: PropTypes.func.isRequired,
  sx: PropTypes.object,
  value: PropTypes.any,
  dateStart: PropTypes.instanceOf(Date),
  dateEnd: PropTypes.instanceOf(Date),
};
