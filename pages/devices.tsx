import Avatar from "@/components/Avatar";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import SearchableDropdown from "@/components/Dropdown";
import AppEmptyState from "@/components/EmptyState";
import GradientProgressBar from "@/components/GradientProgressBar";
import ImageUploader from "@/components/ImageUploader";
import InputField from "@/components/InputField";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import ModalSide from "@/components/ModalSide";
import PaginationControls from "@/components/PaginationControls";
import Text from "@/components/Text";
import deviceService, { Device } from "@/services/deviceService";
import { formatNumberN } from "@/utils/functions";
import { locations } from "@/utils/items";
import { Edit, Eye, Image, Plus, Search, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Devices() {
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [devices, setDevices] = useState<Device[] | []>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Device");
  const [buttonText, setButtonText] = useState("Save");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [location, setLocation] = useState("UK");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [images, setImages] = useState<string[] | []>([]);
  const [progress, setProgress] = useState(50);
  const [currentStep, setCurrentStep] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDevice, setShowDevice] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [errors, setErrors] = useState({
    model: "",
    manufacturer: "",
    screenSize: "",
    processor: "",
    ram: "",
    storage: "",
    totalUnits: "",
  });

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const page = currentPage;
      const data = await deviceService.fetchDevices(page, limit);
      const pagination = data.data.pagination;
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

  useEffect(() => {
    fetchDevices();
  }, []);

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

  const filteredDevices = devices.filter(
    (device) =>
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.processor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.screenSize.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // validate required fields
  const validateField = (field: string, value: string) => {
    let message = "";

    if (!value.trim()) {
      message = `${field} is required`;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // Submit device creation request
  const handleNewSubmit = async () => {
    setIsProcessing(true);

    try {
      const response = await deviceService.registerDevice({
        model,
        manufacturer,
        screenSize,
        processor,
        ram: parseInt(ram),
        storage,
        units: parseInt(totalUnits),
        location,
      });

      console.log("Location", location);

      if (response.status === 201) {
        toast.success(response.message);
        setDevice(response.data);
        setProgress(100);
        setCurrentStep(2);
        setIsUpdatingImages(true);
        fetchDevices();
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

  const handleInitiateDeviceUpdate = (item: Device) => {
    setModalTitle("Update Device Record");
    setButtonText("Save Changes");
    setDevice(item);
    setModel(item.model);
    setImages(item.images);
    setLocation(item.location);
    setManufacturer(item.manufacturer);
    setProcessor(item.processor);
    setRam(item.ram.toString());
    setScreenSize(item.screenSize);
    setStorage(item.storage.toString());
    setModel(item.totalUnits.toString());
    setCurrentStep(1);
    setProgress(50);
    setIsUpdating(true);
    setIsOpen(true);
  };

  const handleInitiateDeviceDelete = (item: Device) => {
    setDevice(item);
    setIsDeleting(true);
    setOpenModal(true);
  };

  // Submit device update request
  const handleUpdateSubmit = async () => {
    setIsProcessing(true);

    try {
      const id = device?.id;
      const response = await deviceService.updateDevice(id!, {
        model,
        manufacturer,
        screenSize,
        processor,
        ram: parseInt(ram),
        storage,
        units: parseInt(totalUnits),
        location,
      });

      console.log(response);

      if (response.status === 201) {
        toast.success(response.message);
        fetchDevices();
        setModalTitle("Add New Device");
        setButtonText("Save");
        setIsOpen(false);
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

  // Submit device delete request
  const handleDeleteSubmit = async () => {
    setIsProcessing(true);

    try {
      const id = device?.id;
      const response = await deviceService.deleteDevice(id!);

      console.log(response);

      if (response.status === 201) {
        toast.success(response.message);
        setOpenModal(false);
        fetchDevices();
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

  const handleInitiateDeviceImagesUpdate = (item: Device) => {
    setModalTitle("Update Device Images");
    setButtonText("Save Changes");
    setDevice(item);
    setImages(item.images);
    setCurrentStep(2);
    setProgress(100);
    setIsUpdatingImages(true);
    setIsOpen(true);
  };

  // Submit device images update request
  const handleUpdateDeviceImages = async () => {
    setIsProcessing(true);

    try {
      const id = device?.id;
      const response = await deviceService.updateDeviceImages(id!, images);

      console.log(response);

      if (response.status === 201) {
        toast.success(response.message);
        fetchDevices();
        setIsOpen(false);
        setProgress(50);
        setCurrentStep(1);
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

  const handleResetForm = () => {
    setModalTitle("Add New Device");
    setButtonText("Save");
    setDevice(null);
    setModel("");
    setImages([]);
    setLocation("");
    setManufacturer("");
    setProcessor("");
    setRam("");
    setScreenSize("");
    setStorage("");
    setModel("");
    setCurrentStep(1);
    setProgress(50);
    setDevice(null);
    setIsDeleting(false);
    setIsUpdating(false);
    setIsOpen(false);
  };

  // Submit device Units update request
  const handleUpdateDeviceUnits = async () => {
    setIsProcessing(true);

    try {
      const id = device?.id;
      const units = parseInt(totalUnits);
      const response = await deviceService.updateDeviceUnits(id!, units);

      console.log(response);

      if (response.status === 201) {
        toast.success(response.message);
        fetchDevices();
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

  const handleImageChange = (urls: string[]) => {
    setImages(urls);
  };

  const handleSelect = (value: string) => {
    setLocation(value);
  };

  const handleViewRecord = (item: Device) => {
    setDevice(item);
    setShowDevice(true);
    console.log(item);
  };

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? device!.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === device!.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <MainLayout>
      <Breadcrumb
        title="Manage Devices"
        count={total}
        isLoading={loading}
        actions={
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2" /> Device
          </Button>
        }
      />

      {devices.length > 0 && (
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
                  {[
                    "Model",
                    "Units",
                    "Location",
                    "Processor",
                    "Storage",
                    "Screen",
                    "Status",
                    "Actions",
                  ].map((title) => (
                    <th
                      key={title}
                      className="text-left px-4 py-4 whitespace-nowrap"
                    >
                      <Text text={title} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      filteredDevices.length - 1 > index
                        ? "shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Avatar imageUrl={row.images[0]} username={row.model} />
                        <div className="">
                          <Text text={row.manufacturer} size="small" />
                          <Text text={row.model} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={formatNumberN(row.totalUnits)} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={row.location} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={row.processor} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Text text={`${row.ram} RAM`} size="small" />
                        <Text text={`${row.storage} GB`} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Text text={`${row.screenSize} "`} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center space-x-2 rounded-full px-2 py-1 text-white text-[14px] ${
                          row.status === "Deleted"
                            ? "bg-[#E30045]"
                            : row.status === "Unverified"
                            ? "bg-amber-500"
                            : row.status === "Inactive"
                            ? "bg-slate-800"
                            : "bg-[#12B76A]"
                        }`}
                      >
                        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                        {row.status.toLowerCase()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRecord(row)}
                          className="p-1 cursor-pointer text-primary"
                        >
                          <Eye />
                        </button>
                        <button
                          onClick={() => handleInitiateDeviceUpdate(row)}
                          className="p-1 cursor-pointer text-yellow-400 text-black"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => handleInitiateDeviceImagesUpdate(row)}
                          className="p-1 cursor-pointer text-purple-600"
                        >
                          <Image />
                        </button>
                        <button
                          onClick={() => handleInitiateDeviceDelete(row)}
                          className="p-1 cursor-pointer text-red-500"
                        >
                          <Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            type="devices"
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousClick={handlePreviousClick}
            handleNextClick={handleNextClick}
            renderPages={renderPages}
          />
        </div>
      )}

      {devices.length < 1 && (
        <AppEmptyState
          text="No device found"
          page="Device"
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
        onClick={
          isUpdatingImages
            ? handleUpdateDeviceImages
            : isUpdating
            ? handleUpdateSubmit
            : handleNewSubmit
        }
      >
        <div className="flex flex-col space-y-2 mb-6">
          <Text
            text={`It's time to add a new device to stock. Step one is to provide device basic details and Step two is upload clean and images of the device`}
          />

          <div className="flex flex-col space-y-3 my-8">
            <div className="flex flex-row justify-between items-center">
              <Text
                text={`${
                  currentStep === 2
                    ? "Upload Device Images"
                    : "Provide Device Basic Details"
                }`}
                weight="font-bold"
              />
              <div className="flex flex-row justify-end items-center space-x-1">
                <Text text={currentStep} isTitleText={true} />
                <Text text={`of 2`} />
              </div>
            </div>
            <GradientProgressBar progress={progress} />
          </div>

          {currentStep === 1 && (
            <>
              <InputField
                id={`manufacturer`}
                label={`Device Manufacture`}
                placeholder={`Apple`}
                type="manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                onBlur={() => validateField("manufacturer", manufacturer)}
                showError={!!errors.manufacturer}
                errorText={"Device Manufacture is required"}
                required
              />

              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 md:col-span-1">
                  <SearchableDropdown
                    label="Device Location"
                    items={locations}
                    placeholder="Choose this device location"
                    onSelect={handleSelect}
                  />
                </div>
                <div className="col-span-2 md:col-span-1 pt-6">
                  <InputField
                    id={`model`}
                    label={`Device Model`}
                    placeholder={`MacBook Pro 2025`}
                    type="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    onBlur={() => validateField("model", model)}
                    showError={!!errors.model}
                    errorText={"Device Model is required"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 md:col-span-1">
                  <InputField
                    id={`screenSize`}
                    label={`Screen Size`}
                    placeholder={`16 "`}
                    type="screenSize"
                    value={screenSize}
                    onChange={(e) => setScreenSize(e.target.value)}
                    showError={!!errors.screenSize}
                    errorText={"Screen Size is required"}
                    required
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <InputField
                    id={`processor`}
                    label={`Device processor`}
                    placeholder={`MacBook Pro 2025`}
                    type="processor"
                    value={processor}
                    onChange={(e) => setProcessor(e.target.value)}
                    onBlur={() => validateField("processor", processor)}
                    showError={!!errors.processor}
                    errorText={"Device processor is required"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3 md:col-span-1">
                  <InputField
                    id={`ram`}
                    label={`Random Access Memory (RAM)`}
                    placeholder={`32`}
                    type="ram"
                    value={ram}
                    onChange={(e) =>
                      setRam(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    showError={!!errors.ram}
                    errorText={"Device Random Access Memory (RAM) is required"}
                    required
                  />
                </div>
                <div className="col-span-3 md:col-span-1">
                  <InputField
                    id={`storage`}
                    label={`Device Storage`}
                    placeholder={`500 SSD`}
                    type="storage"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    showError={!!errors.storage}
                    errorText={"Device Storage is required"}
                    required
                  />
                </div>
                <div className="col-span-3 md:col-span-1">
                  <InputField
                    id={`totalUnits`}
                    label={`Device TotalUnits `}
                    placeholder={`24`}
                    type="totalUnits"
                    value={totalUnits}
                    onChange={(e) =>
                      setTotalUnits(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    showError={!!errors.totalUnits}
                    errorText={"Device Total Units is required"}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && <ImageUploader onChange={handleImageChange} />}
        </div>
      </ModalSide>

      <Modal
        title="Delete Device"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onClick={handleDeleteSubmit}
        buttonText="Yes, Delete Device"
        size="small"
        isSingleButton={false}
        isProcessing={isProcessing}
        isBottomModal={false}
        hasButton={true}
      >
        <Text text="Are you sure you want to delete this device?. This action is not reversible, we encourage you to get proper approvals before proceeding with device deletion." />
      </Modal>

      <ModalSide
        isOpen={showDevice}
        onClose={() => setShowDevice(false)}
        title={"Viewing Device Information"}
        isSingleButton={true}
      >
        <div className="flex flex-col space-y-2 mb-6">
          <div className="relative h-72 md:h-96 bg-black">
            <img
              src={device?.images[currentImage]}
              alt="Device"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-black"
            >
              &#8592;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-black"
            >
              &#8594;
            </button>

            <div className="absolute bottom-4 w-full flex justify-center gap-2">
              {device?.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentImage ? "bg-white" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Model" value={device?.model} />
            <Detail label="Manufacturer" value={device?.manufacturer} />
            <Detail label="Location" value={device?.location} />
            <Detail label="Processor" value={device?.processor} />
            <Detail label="RAM" value={`${device?.ram} GB`} />
            <Detail label="Storage" value={`${device?.storage} GB`} />
            <Detail label="Screen Size" value={`${device?.screenSize}\"`} />
            <Detail label="Units Available" value={device?.totalUnits} />
            <Detail label="Status" value={device?.status} />
          </div>
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
