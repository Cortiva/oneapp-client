import AuthDecider from "@/components/AuthDecider";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import Text from "@/components/Text";
import authService from "@/services/authService";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { encryptData } from "@/utils/functions";

export default function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("IT Manager");
  const router = useRouter();

  const goTo = (page: string) => {
    router.push(page);
  };

  const handleLogin = async () => {
    setIsProcessing(true);

    try {
      const response = await authService.login({ email, password });
      console.log(response);

      if (response.status === 201) {
        setUsername(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );

        // Encrypt user and token before storing on local storage
        const user = encryptData(response.data.user);
        const token = encryptData(response.data.token);

        localStorage.setItem("oau", user);

        Cookies.set("token", token, { expires: 7 });

        router.replace("/");
      } else {
        toast.error("Login failed");
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "Login failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 mb-6">
        <Text
          text={`Welcome back, ${username}.`}
          isTitleText={true}
          size="big"
        />
        <Text
          text={`Provide your email address and password to sign into your oneapp account.`}
        />
      </div>

      <form className="space-y-4">
        <InputField
          id={`email`}
          label={`Email Address`}
          placeholder={`john.doe@domain.ccom`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          id={`password`}
          label={`Password`}
          placeholder={`********`}
          isPassword={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-row justify-end">
          <div className="cursor-pointer text-[#545454] dark:text-[#CBD5E1]">
            Forgot Password?
          </div>
        </div>

        <div className="mt-10">
          <Button
            isDisabled={isProcessing}
            isProcessing={isProcessing}
            isFullWidth={true}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </form>
      <div className="flex flex-col items-center mb-5">
        <AuthDecider isSignIn={true} />
      </div>
    </AuthLayout>
  );
}
