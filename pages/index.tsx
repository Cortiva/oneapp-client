import Breadcrumb from "@/components/Breadcrumb";
// import Button from "@/components/Button";
// import AppEmptyState from "@/components/EmptyState";
// import InputField from "@/components/InputField";
import MainLayout from "@/components/MainLayout";
// import ModalSide from "@/components/ModalSide";
// import PaginationControls from "@/components/PaginationControls";
// import Text from "@/components/Text";
// import deviceService, { Device } from "@/services/deviceService";
// import { Check, Plus, Search } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";

export default function Home() {
  // const [totalPages, setTotalPages] = useState(1);
  // const [total, setTotal] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [devices, setDevices] = useState<Device[] | []>([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [modalTitle, setModalTitle] = useState("Add New Device");
  // const [buttonText, setButtonText] = useState("Save");

  // const fetchDevices = async (page: number) => {
  //   try {
  //     setLoading(true);
  //     const data = await deviceService.fetchDevices(page, limit);
  //     const pagination = data.data.pagination;
  //     setDevices(data.data.data);
  //     setTotalPages(pagination.totalPages);
  //     setCurrentPage(pagination.page);
  //     setLimit(pagination.limit);
  //     setTotal(pagination.total);
  //   } catch (error) {
  //     console.error("Failed to fetch devices", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchDevices(currentPage);
  // }, [currentPage]);

  return (
    <MainLayout>
      <Breadcrumb title="Dashboard" />
      This is the dashboard
    </MainLayout>
  );
}
