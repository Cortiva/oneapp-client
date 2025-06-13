import { AxiosError, AxiosResponse } from "axios";
import api from "./api";

export interface FetchDeviceResponse {
  status: number;
  message: string;
  data: Device;
}

export interface FetchDevicesResponse {
  status: number;
  message: string;
  data: {
    data: Device[];
    pagination: {
      limit: number;
      page: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface Device {
  id: string;
  model: string;
  manufacturer: string;
  screenSize: string;
  processor: string;
  ram: number;
  storage: number;
  status: string;
  isDeleted: boolean;
  images: string[];
  totalUnits: number;
  location: string;
}

interface RegisterDeviceRequest {
  id?: string;
  model: string;
  manufacturer: string;
  screenSize: string;
  processor: string;
  ram: number;
  storage: string;
  units: number;
  location: string;
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

// Device Service
const deviceService = {
  /**
   * Register new device
   * @param credentials
   * @returns
   */
  registerDevice: async (
    credentials: RegisterDeviceRequest
  ): Promise<FetchDeviceResponse> => {
    try {
      const response: AxiosResponse<FetchDeviceResponse> = await api.post(
        "/devices/add",
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Update existing device
   * @param credentials
   * @returns
   */
  updateDevice: async (
    id: string,
    credentials: RegisterDeviceRequest
  ): Promise<FetchDeviceResponse> => {
    try {
      const response: AxiosResponse<FetchDeviceResponse> = await api.put(
        `/devices/${id}/update`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Update device images
   * @param credentials
   * @returns
   */
  updateDeviceImages: async (
    id: string,
    images: string[]
  ): Promise<FetchDeviceResponse> => {
    try {
      const response: AxiosResponse<FetchDeviceResponse> = await api.put(
        `/devices/${id}/images`,
        { images }
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Update existing device units
   * @param credentials
   * @returns
   */
  updateDeviceUnits: async (
    id: string,
    units: number
  ): Promise<FetchDeviceResponse> => {
    try {
      const response: AxiosResponse<FetchDeviceResponse> = await api.put(
        `/devices/${id}/units`,
        { units }
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * delete existing device
   * @param credentials
   * @returns
   */
  deleteDevice: async (id: string): Promise<FetchDeviceResponse> => {
    try {
      const response: AxiosResponse<FetchDeviceResponse> = await api.delete(
        `/devices/${id}/delete`
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Fetch devices
   * @param userData
   * @returns Promise
   */
  fetchDevices: async (
    page: number,
    limit: number
  ): Promise<FetchDevicesResponse> => {
    try {
      const response: AxiosResponse<FetchDevicesResponse> = await api.get(
        `/devices/all?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

export default deviceService;
