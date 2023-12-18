import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { TotalCheckout } from "src/sections/overview/overview-budget";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { TotalCheckin } from "src/sections/overview/overview-total-customers";
import { TotalGuestInCome } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useState } from "react";
const now = new Date();

const Page = () => {
  const [checkoutValue, setCheckoutValue] = useState(null);
  const handleCheckoutValue = (value) => {
    setCheckoutValue(value);
  };
  return (
    <>
      <Head>
        <title>Overview | Smart Parking</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <TotalCheckout difference={16} positive={false} sx={{ height: "100%" }} value="1.6k" />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <TotalCheckin difference={16} positive={false} sx={{ height: "100%" }} value="1.6k" />
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <TotalGuestInCome sx={{ height: "100%" }} value="$15k" />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Desktop", "Tablet", "Phone"]}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
