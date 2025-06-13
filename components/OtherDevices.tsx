import React from "react";
import Text from "./Text";

const DeviceCard = ({
  device,
  onSelect,
}: {
  device: any;
  onSelect: (device: any) => void;
}) => {
  return (
    <div className="rounded-2xl bg-light-bg dark:bg-dark-bg shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={device.images[0]}
          alt={device.model}
          className="object-cover w-full h-full transform hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-md shadow-md">
          {device.location}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Text text={device.manufacturer} weight="font-bold" />
        <Text text={device.model} />
        <Text
          text={`${device.processor} • ${device.ram}GB RAM • ${device.storage}GB`}
        />
        <button
          onClick={() => onSelect(device)}
          className="mt-auto bg-primary-300 text-white text-sm py-2 px-4 rounded-md hover:bg-primary-600 transition"
        >
          Select Device
        </button>
      </div>
    </div>
  );
};

const OtherDevicesSection = ({
  devices,
  onSelectDevice,
  excludeId,
}: {
  devices: any[];
  onSelectDevice: (device: any) => void;
  excludeId?: string;
}) => {
  const filteredDevices = devices.filter((d) => d.id !== excludeId);

  return (
    <section className="mt-10 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        More Devices to Pick From
      </h2>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        {filteredDevices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onSelect={onSelectDevice}
          />
        ))}
      </div>
    </section>
  );
};

export default OtherDevicesSection;
