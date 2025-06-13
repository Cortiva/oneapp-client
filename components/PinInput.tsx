"use client";

import { useState, useRef } from "react";

interface PinInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ length = 6, onComplete }) => {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      } else {
        const fullCode = newCodes.join("");
        if (!newCodes.includes("")) {
          onComplete(fullCode);
        }
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !codes[index]) {
      if (index > 0) {
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        setCodes(newCodes);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="flex justify-between">
      {codes.map((code, index) => (
        <div key={index}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            onFocus={handleFocus}
            ref={(el) => (inputsRef.current[index] = el)}
            className="p-4 rounded-lg text-lg bg-light-bg dark:bg-dark-bg shadow transition-all duration-200 focus:shadow-md text-center"
            style={{ width: "60px", height: "60px", fontSize: "30px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default PinInput;
