import { AxiosError, AxiosResponse } from "axios";
import api from "./api";
import { Device } from "./deviceService";
import { User } from "./authService";

export interface FetchEmployeeResponse {
  status: number;
  message: string;
  data: Employee;
}

export interface FetchEmployeesResponse {
  status: number;
  message: string;
  data: {
    data: Employee[];
    pagination: {
      limit: number;
      page: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface Employee {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  officeLocation: string;
  role: string;
  onboardingDate: string;
  onboardedBy: string;
  avatar: string;
  createdAt: string;
  devices: EmployeeDevice[];
}

export interface EmployeeDevice {
  id: string;
  device: Device;
  assignedOn?: any;
  assignedBy: User;
  retrievedOn?: any;
  remark?: string;
}

interface AssignDeviceRequest {
  employeeId?: string;
  deviceId?: string;
  assignedOn?: any;
  assignedById?: string;
  remark?: string;
}

interface RegisterEmployeeRequest {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  staffId: string;
  phoneNumber: string;
  officeLocation: string;
  onboardedById: string;
  role: string;
  avatar?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const handleError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || "An error occurred",
      status: error.response.status,
    };
  }
  return { message: error.message || "An error occurred" };
};

// Employee Service
const employeeService = {
  /**
   * Register new Employee
   * @param credentials
   * @returns
   */
  registerEmployee: async (
    credentials: RegisterEmployeeRequest
  ): Promise<FetchEmployeeResponse> => {
    try {
      const response: AxiosResponse<FetchEmployeeResponse> = await api.post(
        "/employees/onboard",
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Update existing Employee
   * @param credentials
   * @returns
   */
  updateEmployee: async (
    id: string,
    credentials: RegisterEmployeeRequest
  ): Promise<FetchEmployeeResponse> => {
    try {
      const response: AxiosResponse<FetchEmployeeResponse> = await api.put(
        `/employees/${id}/update`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * assignDeviceTo existing Employee
   * @param credentials
   * @returns
   */
  assignDeviceToEmployee: async (
    credentials: AssignDeviceRequest
  ): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post(
        `/employee/devices/assign`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Fetch Employees
   * @param userData
   * @returns Promise
   */
  fetchEmployees: async (
    page: number,
    limit: number
  ): Promise<FetchEmployeesResponse> => {
    try {
      const response: AxiosResponse<FetchEmployeesResponse> = await api.get(
        `/employees/all?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

export default employeeService;
