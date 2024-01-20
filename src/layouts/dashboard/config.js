import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";

import { SpeedDialIcon, SvgIcon } from "@mui/material";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import ClipboardDocumentIcon from "@heroicons/react/24/solid/ClipboardDocumentIcon";
import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";

import CreditCardIcon from "@heroicons/react/24/solid/CreditCardIcon";
export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Registration",
    path: "/registrations",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parking Options",
    path: "/parkingOptions",
    icon: (
      <SvgIcon fontSize="small">
        <ArrowTopRightOnSquareIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parking Order",
    path: "/orders",
    icon: (
      <SvgIcon fontSize="small">
        <PhoneIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parking Sessions",
    path: "/parkingSessions",
    icon: (
      <SvgIcon fontSize="small">
        <ClockIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Users",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Manage Cards",
    path: "/cards",
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parking Types & Fees",
    path: "/parkingTypes",
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Payments",
    path: "/payments",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Bikes",
    path: "/bikes",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: "Settings",
  //   path: "/settings",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   ),
  // },

  // {
  //   title: "Login",
  //   path: "/auth/login",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Register",
  //   path: "/auth/register",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   ),
  // },
  // {
  //   title: "Logout",
  //   path: "/404",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   ),
  // },
];
