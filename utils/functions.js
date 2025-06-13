import CryptoJS from "crypto-js";

const secretKey = process.env.SECRET_KEY || "";

export const formatNumberN = (number, decimals = 0) => {
  const num = Number(number);
  const formattedNumber = num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedNumber;
};

export const hasEmptyValue = (data) => {
  if (Array.isArray(data)) {
    return data.some(value => value === null || value === undefined || value === '');
  } else if (typeof data === 'object' && data !== null) {
    return Object.values(data).some(value => value === null || value === undefined || value === '');
  } else {
    console.log('Input should be an array or an object');
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

export const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const formatRole = (role)  => {
  return role
    .toLowerCase()       
    .replace(/_/g, ' ')     
    .replace(/\b\w/g, c => c.toUpperCase()); 
}