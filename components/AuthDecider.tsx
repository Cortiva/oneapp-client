import React from "react";
import Text from "./Text";
import { useRouter } from "next/router";

type AuthDeciderProps = {
  isSignIn?: boolean;
  isReset?: boolean;
};

const AuthDecider: React.FC<AuthDeciderProps> = ({
  isSignIn = true,
  isReset = false,
}) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(
      isReset ? "/forgotPassword" : isSignIn ? "/register" : "/login"
    );
  };

  return (
    <div className="flex space-x-3 text-[16px] lg:text-[18px] 2xl:text-[19px] mt-3">
      <Text
        text={
          isReset
            ? "Remembered your password? "
            : !isSignIn
            ? "Already have an account? "
            : "Don't have an account yet? "
        }
      />
      <Text
        text={!isSignIn ? "Sign In " : "Create One Here"}
        weight="font-semibold"
        onClick={handleNavigation}
        hasHover
        color="text-primary"
      />
    </div>
  );
};

export default AuthDecider;
