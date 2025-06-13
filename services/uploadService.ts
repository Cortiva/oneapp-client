export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "medisync");
  formData.append("folder", "Medisync");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/etechds/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url || null;
  } catch (err) {
    console.error("Cloudinary Upload Failed", err);
    return null;
  }
};
