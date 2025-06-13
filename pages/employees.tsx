import Avatar from "@/components/Avatar";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import SearchableDropdown from "@/components/Dropdown";
import AppEmptyState from "@/components/EmptyState";
import ImageUploader from "@/components/ImageUploader";
import InputField from "@/components/InputField";
import MainLayout from "@/components/MainLayout";
import ModalSide from "@/components/ModalSide";
import PaginationControls from "@/components/PaginationControls";
import Text from "@/components/Text";
import employeeService, { Employee } from "@/services/employeeService";
import { decryptData } from "@/utils/functions";
import { locations, roles } from "@/utils/items";
import { Eye, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "@/services/authService";
import Image from "next/image";
import deviceService, { Device } from "@/services/deviceService";
import OtherDevicesSection from "@/components/OtherDevices";

export default function Employees() {
  const [user, setUser] = useState<User | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [employees, setEmployees] = useState<Employee[] | []>([]);
  const [devices, setDevices] = useState<Device[] | []>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDeviceTerm, setSearchDeviceTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Device");
  const [buttonText, setButtonText] = useState("Save");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");

  const [assignDevice, setAssignDevice] = useState(false);
  // const [isUpdating, setIsUpdating] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    staffId: "",
    officeLocation: "",
  });

  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [recommendedDevice, setRecommendedDevice] = useState<Device | null>(
    null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("oau");
    if (!storedUser) {
      console.log("No User found");
    } else {
      // Decrypt stored user
      const decryptedUser = decryptData(storedUser);
      console.log("dec user :::::: ", decryptedUser);
      setUser(decryptedUser);
    }
  }, [setUser]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const page = currentPage;
      const data = await deviceService.fetchDevices(page, limit);
      const pagination = data.data.pagination;
      // console.log("DEVICES::::::::: ", data.data.data);
      setDevices(data.data.data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.page);
      setLimit(pagination.limit);
      setTotal(pagination.total);
    } catch (error) {
      console.error("Failed to fetch devices", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const page = currentPage;
      const data = await employeeService.fetchEmployees(page, limit);
      const pagination = data.data.pagination;
      setEmployees(data.data.data);
      console.log("EMPLOYEES::::::::: ", data.data.data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.page);
      setLimit(pagination.limit);
      setTotal(pagination.total);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchDevices();
  }, [currentPage]);

  const handlePageClick = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );

  const handleNextClick = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [setCurrentPage, currentPage]);

  const handlePreviousClick = useCallback(() => {
    setCurrentPage(currentPage - 1);
  }, [setCurrentPage, currentPage]);

  const renderPages = useCallback(() => {
    const pages = [];
    const maxPagesToShow = 4;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= maxPagesToShow ||
        i === currentPage ||
        i > totalPages - 1 ||
        i < currentPage + maxPagesToShow
      ) {
        pages.push(
          <div
            key={i}
            onClick={() => handlePageClick(i)}
            className={`mx-1 cursor-pointer`}
          >
            <Text
              text={i}
              color={`${currentPage === i ? "text-blue-500 font-bold" : ""}`}
            />
          </div>
        );
      } else if (
        i === maxPagesToShow + 1 ||
        i === totalPages - maxPagesToShow
      ) {
        pages.push(
          <span key={i} className="mx-1">
            ...
          </span>
        );
      }
    }

    return pages;
  }, [handlePageClick, currentPage, totalPages]);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.officeLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Submit device creation request
  const handleNewSubmit = async () => {
    setIsProcessing(true);

    try {
      const response = await employeeService.registerEmployee({
        firstName,
        lastName,
        email,
        staffId,
        phoneNumber,
        officeLocation,
        onboardedById: user!.id,
        role,
        avatar: image,
      });

      if (response.status === 201) {
        toast.success(response.message);
        setEmployee(response.data);
        fetchRecords();
        handleResetForm();
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

  // const handleInitiateUpdate = (item: Employee) => {
  //   setModalTitle("Update Employee Record");
  //   setButtonText("Save Changes");
  //   setEmployee(item);

  //   setEmail(item.email);
  //   setFirstName(item.firstName);
  //   setLastName(item.lastName);
  //   setOfficeLocation(item.officeLocation);
  //   setPhoneNumber(item.phoneNumber);
  //   setRole(item.role);
  //   setStaffId(item.staffId);

  //   setIsUpdating(true);
  //   setIsOpen(true);
  // };

  // // Submit employee update request
  // const handleUpdateSubmit = async () => {
  //   setIsProcessing(true);

  //   try {
  //     const id = employee?.id;
  //     const response = await employeeService.updateEmployee(id!, {
  //       firstName,
  //   lastName,
  //   email,
  //   staffId,
  //   phoneNumber,
  //   officeLocation,
  //   onboardedById: user!.id,
  //   role,
  //     });

  //     if (response.status === 201) {
  //       toast.success(response.message);
  //       fetchRecords();
  //       setModalTitle("Add New Employee");
  //       setButtonText("Save");
  //       setIsOpen(false);
  //       handleResetForm();
  //     } else {
  //       toast.success(response.message);
  //     }
  //   } catch (error: any) {
  //     console.log("error :::: ", error);
  //     toast.error(error.message || "failed to create account");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleResetForm = () => {
    setModalTitle("Add New Employee");
    setButtonText("Save");
    setEmployee(null);

    setEmail("");
    setFirstName("");
    setLastName("");
    setOfficeLocation("");
    setPhoneNumber("");
    setRole("");
    setStaffId("");

    // setIsUpdating(false);
    setIsOpen(false);
  };

  const handleImageChange = (urls: string[]) => {
    setImage(urls[0]);
  };

  const handleSelectRole = (value: string) => {
    setRole(value);
  };

  const handleSelect = (value: string) => {
    setOfficeLocation(value);
  };

  const handleViewRecord = (item: Employee) => {
    setEmployee(item);
    setShowRecord(true);
    console.log(item);
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

  const handleInitiateDeviceAssignment = (item: Employee) => {
    setEmployee(item);

    console.log("CHOSEN :::::: ", item);

    const recommended: any =
      devices.find(
        (d) =>
          d.status === "AVAILABLE" &&
          d.location.toUpperCase() === item.officeLocation.toUpperCase() &&
          !item.role
      ) ||
      devices.find(
        (d) =>
          d.status === "AVAILABLE" &&
          d.location.toUpperCase() === item.officeLocation.toUpperCase()
      );

    setRecommendedDevice(recommended);

    setAssignDevice(true);
  };

  // DEVICE
  const filteredDevices = devices.filter(
    (device) =>
      device.location.toLowerCase().includes(searchDeviceTerm.toLowerCase()) ||
      device.status.toLowerCase().includes(searchDeviceTerm.toLowerCase()) ||
      device.manufacturer
        .toLowerCase()
        .includes(searchDeviceTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchDeviceTerm.toLowerCase()) ||
      device.processor.toLowerCase().includes(searchDeviceTerm.toLowerCase()) ||
      device.screenSize.toLowerCase().includes(searchDeviceTerm.toLowerCase())
  );

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (diff > 50) {
      setCurrentImage((prev) =>
        prev === 0 ? recommendedDevice!.images.length - 1 : prev - 1
      );
    } else if (diff < -50) {
      setCurrentImage((prev) =>
        prev === recommendedDevice!.images.length - 1 ? 0 : prev + 1
      );
    }
    setTouchStart(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (recommendedDevice) {
        setCurrentImage((prev) => (prev + 1) % recommendedDevice.images.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [recommendedDevice]);

  const handleAssignDevice = async () => {
    try {
      const response = await employeeService.assignDeviceToEmployee({
        employeeId: employee?.id,
        deviceId: recommendedDevice?.id,
        assignedOn: new Date(),
        assignedById: user?.id,
        remark: "You have been assigned a new device",
      });

      if (response.status === 201) {
        toast.success(response.message);
        setEmployee(response.data);
        fetchRecords();
        handleResetForm();
        setAssignDevice(false);
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

  return (
    <MainLayout>
      <Breadcrumb
        title="Manage Employees"
        count={total}
        isLoading={loading}
        actions={
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2" /> Employee
          </Button>
        }
      />

      {employees.length > 0 && (
        <div className="flex flex-col bg-light-card dark:bg-dark-card mt-10 p-1 rounded-[14px]">
          <div className="grid grid-cols-2 gap-10 mb-6">
            <div className="col-span-2 lg:col-span-1"></div>
            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-row justify-end items-center">
                <div></div>
                <div className="w-[70%] ml-4">
                  <InputField
                    id="email"
                    placeholder={`Search Here`}
                    type="text"
                    hasPrefix={true}
                    prefixIcon={<Search size={18} />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto mt-6 shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)] mb-6">
            <table className="min-w-[1000px] w-full border-collapse">
              <thead>
                <tr className="shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)] text-[13px]">
                  {["Data", "Email", "Location", "Phone Number", "Actions"].map(
                    (title) => (
                      <th
                        key={title}
                        className="text-left px-4 py-4 whitespace-nowrap"
                      >
                        <Text text={title} />
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      filteredEmployees.length - 1 > index
                        ? "shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Avatar
                          imageUrl={row.avatar}
                          username={row.firstName}
                        />
                        <div className="">
                          <Text
                            text={`Staff ID: ${row.staffId}`}
                            size="small"
                          />
                          <Text text={`${row.firstName} ${row.lastName}`} />
                          <Text text={`${row.role}`} size="small" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={row.email} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={row.officeLocation} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={row.phoneNumber} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRecord(row)}
                          className="p-1 cursor-pointer "
                        >
                          <Eye />
                        </button>
                        <button
                          onClick={() => handleInitiateDeviceAssignment(row)}
                          className="p-1 cursor-pointer bg-primary text-white px-3 py-2 rounded-full"
                        >
                          Assign Device
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            type="employees"
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousClick={handlePreviousClick}
            handleNextClick={handleNextClick}
            renderPages={renderPages}
          />
        </div>
      )}

      {employees.length < 1 && (
        <AppEmptyState
          text="No employee found"
          page="Employee"
          buttonText="Click here"
          onClick={() => setIsOpen(true)}
        />
      )}

      <ModalSide
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        buttonText={buttonText}
        isProcessing={isProcessing}
        onClick={handleNewSubmit}
      >
        <div className="flex flex-col space-y-2 mb-6">
          <Text
            text={`It's time to onboard a new employee. Kindly provide valid employee data`}
          />

          <>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <InputField
                  id={`firstName`}
                  label={`First Name`}
                  placeholder={`John`}
                  type="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => validateField("firstName", firstName)}
                  showError={!!errors.firstName}
                  errorText={"First Name is required"}
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <InputField
                  id={`lastName`}
                  label={`Last Name`}
                  placeholder={`Doe`}
                  type="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => validateField("lastName", lastName)}
                  showError={!!errors.lastName}
                  errorText={"Last Name is required"}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <SearchableDropdown
                  label="Official Role"
                  items={roles}
                  placeholder="Choose this official role"
                  onSelect={handleSelectRole}
                />
              </div>
              <div className="col-span-2 md:col-span-1 ">
                <SearchableDropdown
                  label="Office Location"
                  items={locations}
                  placeholder="Choose this office location"
                  onSelect={handleSelect}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <InputField
                  id={`phoneNumber`}
                  label={`Phone Number`}
                  placeholder={`16 "`}
                  type="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  showError={!!errors.phoneNumber}
                  errorText={"Phone Number is required"}
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <InputField
                  id={`staffId`}
                  label={`Staff ID`}
                  placeholder={`MacBook Pro 2025`}
                  type="staffId"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  onBlur={() => validateField("staffId", staffId)}
                  showError={!!errors.staffId}
                  errorText={"Staff ID is required"}
                  required
                />
              </div>
            </div>

            <InputField
              id={`email`}
              label={`Email Address`}
              placeholder={`MacBook Pro 2025`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => validateField("email", email)}
              showError={!!errors.email}
              errorText={"Email Address is required"}
              required
            />

            <ImageUploader onChange={handleImageChange} />
          </>
        </div>
      </ModalSide>

      <ModalSide
        isOpen={showRecord}
        onClose={() => setShowRecord(false)}
        title={"Viewing Employee Information"}
        isSingleButton={true}
      >
        {employee && (
          <>
            <div className="flex flex-col space-y-2 mb-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 md:col-span-1">
                  <Image
                    src={employee?.avatar}
                    alt="User"
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Detail label="Email" value={employee?.email} />
                  <Detail label="First Name" value={employee?.firstName} />
                  <Detail label="Last Name" value={employee?.lastName} />
                  <Detail
                    label="Office Location"
                    value={employee?.officeLocation}
                  />
                  <Detail
                    label="Onboarded On"
                    value={`${employee?.onboardingDate} `}
                  />
                  <Detail label="Staff ID" value={`${employee?.staffId}`} />
                </div>
              </div>

              {employee.devices.map((item, index) => (
                <div key={index}>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="col-span-2 md:col-span-1">
                      <Detail
                        label="Device Model"
                        value={`${item.device.model}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Detail
                        label="Device Manufacturer"
                        value={`${item.device.manufacturer}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Detail
                        label="Device Processor"
                        value={`${item.device.processor}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Detail
                        label="Device Storage"
                        value={`${item.device.storage}`}
                      />
                      <Detail label="Device RAM" value={`${item.device.ram}`} />
                    </div>
                  </div>

                  {item.device.images.map((image, index) => (
                    <div key={index} className="flex flex-row space-x-5">
                      <img
                        src={image}
                        alt={`img`}
                        className="h-[220px] w-[220px] object-cover rounded shadow"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </ModalSide>

      <ModalSide
        isOpen={assignDevice}
        onClose={() => setAssignDevice(false)}
        title={"Device Assignment"}
        buttonText={`Continue with ${recommendedDevice?.manufacturer} 
              ${recommendedDevice?.model}`}
        isProcessing={isProcessing}
        onClick={handleAssignDevice}
      >
        <div className="flex flex-col space-y-6">
          <div className="">
            <Text text="Recommended Device" weight="font-bold" mb="mb-1" />
            <Text text="Based on the Designer role and Ireland location" />
          </div>

          {recommendedDevice && (
            <>
              <div
                className="relative h-64 sm:h-80 bg-gray-100 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={recommendedDevice?.images[currentImage]}
                  alt="Device"
                  className="w-full h-full object-cover transition duration-300 ease-in-out"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {recommendedDevice?.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImage ? "bg-white" : "bg-gray-400"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <h2 className="text-xl font-semibold">
                  {recommendedDevice?.manufacturer}
                </h2>
                <p className="text-sm text-gray-500">
                  Model: {recommendedDevice?.model}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Processor:</strong> {recommendedDevice?.processor}
                  </p>
                  <p>
                    <strong>RAM:</strong> {recommendedDevice?.ram}GB
                  </p>
                  <p>
                    <strong>Storage:</strong> {recommendedDevice?.storage}GB
                  </p>
                  <p>
                    <strong>Screen:</strong> {recommendedDevice?.screenSize}"
                  </p>
                  <p>
                    <strong>Location:</strong> {recommendedDevice?.location}
                  </p>
                  <p>
                    <strong>Units:</strong> {recommendedDevice?.totalUnits}
                  </p>
                </div>
                <div className="flex flex-row justify-center items-center space-x-5 mt-10">
                  <Button
                    isProcessing={isProcessing}
                    isDisabled={isProcessing}
                    onClick={handleAssignDevice}
                  >
                    Assign this device
                  </Button>
                  <Text text="Or browse all available devices below" />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-3 md:col-span-1 pt-6">
              <InputField
                id="search"
                placeholder={`Search Here`}
                type="text"
                hasPrefix={true}
                prefixIcon={<Search size={18} />}
                value={searchDeviceTerm}
                onChange={(e) => setSearchDeviceTerm(e.target.value)}
              />
            </div>
            <div className="col-span-3 md:col-span-1">
              <SearchableDropdown
                items={roles}
                placeholder="Choose role"
                onSelect={handleSelectRole}
              />
            </div>
            <div className="col-span-3 md:col-span-1">
              <SearchableDropdown
                items={roles}
                placeholder="Choose location"
                onSelect={handleSelectRole}
              />
            </div>
          </div>

          <OtherDevicesSection
            devices={devices}
            excludeId={recommendedDevice?.id}
            onSelectDevice={(device) => setRecommendedDevice(device)}
          />

          <div className="my-10">&nbsp;</div>
        </div>
      </ModalSide>
    </MainLayout>
  );
}

const Detail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 dark:text-gray-300 font-medium">
      {label}
    </span>
    <span className="text-gray-800 dark:text-white">{value}</span>
  </div>
);
