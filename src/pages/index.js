import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { useAuthContext } from "src/contexts/auth-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useEffect } from "react";
import { toast } from "react-toastify";
const now = new Date();
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const Page = () => {
  const auth = useAuthContext();
  const token = auth.user.accessToken;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/admin/getTotalCheckin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          toast.error("Error fetching data:", error);
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };
  });
  return <></>;
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
