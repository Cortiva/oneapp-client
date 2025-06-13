import AuthDecider from "@/components/AuthDecider";
import AuthLayout from "@/components/AuthLayout";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import CountdownTimer from "@/components/CountdownTimer";
import SearchableDropdown from "@/components/Dropdown";
import GradientProgressBar from "@/components/GradientProgressBar";
import InputField from "@/components/InputField";
import PinInput from "@/components/PinInput";
import Text from "@/components/Text";
import authService from "@/services/authService";
import { validateEmail } from "@/utils/functions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Register() {
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [otp, setOtp] = useState("");
  const [initialTime, setInitialTime] = useState(5 * 60);
  const [isResending, setIsResending] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const router = useRouter();
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");
  const [hasMinCharacters, setHasMinCharacters] = useState(false);
  const [hasSpecialCharacter, setHasSpecialCharacter] = useState(false);
  const [hasUpperLowerCase, setHasUpperLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [progress, setProgress] = useState(35);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    staffId: "",
    officeLocation: "",
    password: "",
    confirmPassword: "",
  });

  const items = [
    { value: "UK", label: "United Kingdom" },
    { value: "IRELAND", label: "Ireland" },
    { value: "EU", label: "European Union" },
    { value: "AFRICA", label: "Africa" },
    { value: "America", label: "America" },
    { value: "ASIA", label: "Asia" },
  ];

  useEffect(() => {
    const storedEmail = localStorage.getItem("te");
    const storedCurrentStep = localStorage.getItem("cs");

    if (storedEmail) {
      setEmail(storedEmail);
    }

    if (storedCurrentStep) {
      const step = parseInt(storedCurrentStep, 10);
      setCurrentStep(step);
    }
  }, []);

  const handleSelect = (value: string) => {
    setOfficeLocation(value);
  };

  // validate required fields
  const validateField = (field: string, value: string) => {
    let message = "";

    if (!value.trim()) {
      message = `${field} is required`;
    } else {
      if (field === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        message = "Invalid email format";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleCheckEmail = async () => {
    setIsValidating(true);

    try {
      if (!validateEmail(email)) {
        setIsEmailAvailable(false);
        setEmailStatus("The provided email is not valid");
      } else {
        setIsValidating(true);
        const response = await authService.checkEmailAvailability(email);
        console.log(response);
        if (response.status === 200) {
          toast.success(response.message);
          setIsEmailAvailable(true);
        } else {
          setIsEmailAvailable(false);
        }
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "Failed to check email");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsProcessing(true);

    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        staffId,
        phoneNumber,
        officeLocation,
      });

      console.log(response);

      if (response.status === 201) {
        localStorage.setItem("te", email);
        localStorage.setItem("cs", (currentStep + 1).toString());
        toast.success(response.message);
        setProgress(100);
        setCurrentStep(3);
      } else {
        toast.success(response.message);
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "failed to create account");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      const email = localStorage.getItem("te");

      const response = await authService.resendOtp(email!);
      if (response.status === 201) {
        toast.success(response.message);

        setIsResending(false);
        setInitialTime(5 * 60);
        setShowResendButton(false);
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "failed to resend OTP");
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmAccount = async () => {
    setIsProcessing(true);

    try {
      if (!validateEmail(email)) {
        setIsEmailAvailable(false);
        setEmailStatus("The provided email is not valid");
      } else {
        const type = "ONBOARDING";
        const response = await authService.confirmOtp(email, otp, type);
        console.log(response);
        if (response.status === 201) {
          toast.success(response.message);
          localStorage.removeItem("te");
          localStorage.removeItem("cs");
          router.replace("/login");
        } else {
          toast.success(response.message);
        }
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "Failed to confirm account");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateStrength = (password: string) => {
    const isCapitalLetter = /[A-Z]/.test(password);
    const isSmallLetter = /[a-z]/.test(password);
    const isNumber = /[0-9]/.test(password);
    const isSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isMinLength = password.length >= 8;

    setHasUpperLowerCase(isCapitalLetter && isSmallLetter);
    setHasNumber(isNumber);
    setHasSpecialCharacter(isSpecialChar);
    setHasMinCharacters(isMinLength);
  };

  const handlePasswordChanged = (value: string) => {
    setPassword(value);
    calculateStrength(value);

    if (value === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const handleConfirmPasswordChanged = (value: string) => {
    setConfirmPassword(value);

    if (password === value) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const handleSteps = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setProgress(70);
    }

    if (currentStep === 2) {
      handleCreateAccount();
    }

    if (currentStep === 3) {
      handleConfirmAccount();
    }
  };

  const handleTimeUp = () => {
    setShowResendButton(true);
  };

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 mb-6">
        <Text
          text={`Dear IT Manager, welcome to the seamless device management app on the planet`}
          isTitleText={true}
          size="big"
        />
        <Text
          text={`oneapp lets you onboard your employees, assign and retrieve work devices, and have a complete history of device movement. Get started below:`}
        />
      </div>

      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex flex-row justify-between items-center">
          <Text
            text={`${
              currentStep === 3
                ? "Confirm Your Account"
                : currentStep === 2
                ? "Create You Account"
                : "Provide Your Basic Details"
            }`}
            weight="font-bold"
          />
          <div className="flex flex-row justify-end items-center space-x-1">
            <Text text={currentStep} isTitleText={true} />
            <Text text={`of 3`} />
          </div>
        </div>
        <GradientProgressBar progress={progress} />
      </div>

      {currentStep === 1 && (
        <div className="space-y-4">
          <SearchableDropdown
            label="Office Location"
            items={items}
            placeholder="Choose your office location"
            onSelect={handleSelect}
          />

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`firstName`}
                label={`First Name`}
                placeholder={`John Doe`}
                type="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => validateField("firstName", firstName)}
                showError={!!errors.firstName}
                errorText={"First name is required"}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`lastName`}
                label={`Last Name`}
                placeholder={`John Doe`}
                type="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => validateField("lastName", lastName)}
                showError={!!errors.lastName}
                errorText={"Last name is required"}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`phoneNumber`}
                label={`Phone number`}
                placeholder={`+4475637463`}
                type="phoneNumber"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                }
                showError={!!errors.phoneNumber}
                errorText={"Phone number is required"}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`staffId`}
                label={`Staff ID`}
                placeholder={`OA-001`}
                type="staffId"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                showError={!!errors.staffId}
                errorText={"Staff ID is required"}
                required
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <InputField
            id={`email`}
            label={`Email Address`}
            placeholder={`john.doe@domain.ccom`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            showError={!isEmailAvailable}
            errorText={emailStatus}
            showProcessingIcon={isValidating}
            onBlur={handleCheckEmail}
            required
          />

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`password`}
                label={`Password`}
                placeholder={`********`}
                isPassword={true}
                value={password}
                onChange={(e) => handlePasswordChanged(e.target.value)}
                showError={!!errors.password}
                errorText={"Password is required"}
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <InputField
                id={`confirmPassword`}
                label={`Confirm Password`}
                placeholder={`********`}
                isPassword={true}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChanged(e.target.value)}
                showError={!!errors.confirmPassword}
                errorText={"Confirm password is required"}
                required
              />
            </div>
          </div>

          <Text text={`Password must have:`} size="small" />

          <div className="flex space-x-7 mt-1">
            <Checkbox
              label={`Minimum of 8 Characters`}
              labelColor={hasMinCharacters ? "text-primary" : ""}
              isChecked={hasMinCharacters}
              onClick={() => console.log("")}
            />
            <Checkbox
              label={`Special Character`}
              labelColor={hasSpecialCharacter ? "text-primary" : ""}
              isChecked={hasSpecialCharacter}
              onClick={() => console.log("")}
            />
          </div>

          <div className="flex space-x-7 mt-3">
            <Checkbox
              label={`A Digit`}
              labelColor={hasNumber ? "text-primary" : ""}
              isChecked={hasNumber}
              onClick={() => console.log("")}
            />
            <Checkbox
              label={`Match it Pair`}
              labelColor={passwordsMatch ? "text-primary" : ""}
              isChecked={passwordsMatch}
              onClick={() => console.log("")}
            />
            <Checkbox
              label={`Upper & Lower Case`}
              labelColor={hasUpperLowerCase ? "text-primary" : ""}
              isChecked={hasUpperLowerCase}
              onClick={() => console.log("")}
            />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2 mb-6">
            <Text
              text={`We've sent you a One-Time-Password code to ${email}`}
            />
            <Text
              text={`Kindly input the received code below to complete your account creation`}
            />
          </div>

          <PinInput
            length={6}
            onComplete={(code) => {
              setOtp(code);
              console.log("Entered PIN:", code);
            }}
          />

          <div className="flex flex-row justify-between items-center">
            <CountdownTimer initialTime={initialTime} onTimeUp={handleTimeUp} />
            {showResendButton && (
              <>
                {isResending ? (
                  <Loader2 className="animate-spin-fast mr-3 text-primary-300" />
                ) : (
                  <Text
                    text={`Resend OTP`}
                    weight="font-semibold"
                    color={`text-primary`}
                    isClickable={true}
                    onClick={handleResendOtp}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Button
          isDisabled={isProcessing}
          isProcessing={isProcessing}
          isFullWidth={true}
          onClick={handleSteps}
        >
          {currentStep === 1
            ? "Proceed"
            : currentStep === 2
            ? "Create Account"
            : "Confirm Account"}
        </Button>
      </div>

      {currentStep < 3 && (
        <div className="flex flex-col items-center mb-5">
          <AuthDecider isSignIn={false} />
        </div>
      )}
    </AuthLayout>
  );
}
