import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SpeedDialIcon, SvgIcon } from "@mui/material";
import MoneyIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import ComputerDesktopIcon from "@heroicons/react/24/solid/ComputerDesktopIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ListBulletIcon from "@heroicons/react/24/solid/ListBulletIcon";
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import ClockIcon from "@heroicons/react/24/solid/ClockIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
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
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Order",
    path: "/orders",
    icon: (
      <SvgIcon fontSize="small">
        <PhoneIcon/>
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
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Manage Cards",
    path: "/cards",
    icon: (
      <SvgIcon fontSize="small">
        <DeviceTabletIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Parking Types",
    path: "/parkingTypes",
    icon: (
      <SvgIcon fontSize="small">
        <ListBulletIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Fees",
    path: "/fees",
    icon: (
      <SvgIcon fontSize="small">
        <MoneyIcon />
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
        <EllipsisVerticalIcon />
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
