import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";

import { useState } from "react";

export const TotalCheckoutGuest = (props) => {
  const { handleTotalCheckoutGuest, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Guest Checkout
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
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

TotalCheckoutGuest.propTypes = {
  handleCheckoutValueGuest: PropTypes.func,
  sx: PropTypes.object,
  value: PropTypes.any,
  dateStart: PropTypes.instanceOf(Date),
  dateEnd: PropTypes.instanceOf(Date),
};
