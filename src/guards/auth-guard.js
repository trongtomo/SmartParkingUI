import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuthContext } from "src/contexts/auth-context";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (!router.isReady) {
          return;
        }

        if (ignore.current) {
          return;
        }

        ignore.current = true;

        if (!isAuthenticated) {
          await router.replace({
            pathname: "/auth/login",
            //query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
          });
        } else {
          setChecked(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Handle error appropriately, e.g., redirect to an error page.
      }
    };

    checkAuthentication();
  }, [router.isReady, isAuthenticated]);

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
