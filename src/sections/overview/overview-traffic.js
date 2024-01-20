import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";
import PhoneIcon from "@heroicons/react/24/solid/UserIcon";
import ClockIcon from "@heroicons/react/24/solid/UsersIcon";

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
    },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};

const iconMap = {
  Guest: (
    <SvgIcon>
      <PhoneIcon />
    </SvgIcon>
  ),
  Resident: (
    <SvgIcon>
      <ClockIcon />
    </SvgIcon>
  ),
};

export const OverviewTraffic = (props) => {
  const { guestCheckins, residentCheckins, sx } = props;
  const totalCheckins = guestCheckins + residentCheckins;
  const guestPercentage = (guestCheckins / totalCheckins) * 100;
  const residentPercentage = (residentCheckins / totalCheckins) * 100;

  const labels = ["Guest", "Resident"];
  const chartSeries = [guestCheckins, residentCheckins];
  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Check-in Distribution" />
      <CardContent>
        <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {iconMap[label]}
                <Typography sx={{ my: 1 }} variant="h6">
                  {label}
                </Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {index === 0
                    ? `${guestPercentage.toFixed(2)}%`
                    : `${residentPercentage.toFixed(2)}%`}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  guestCheckins: PropTypes.number.isRequired,
  residentCheckins: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
