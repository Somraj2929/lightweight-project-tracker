import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { updateUserAvatar } from "@/app/helper/apiHelpers";
import { FaUpload } from "react-icons/fa6";
import { Spinner } from "@nextui-org/react";

function ProfilePictureUpload({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const trackCustomEvent = (eventName, eventData) => {
    if (typeof window !== "undefined" && window.sa_event) {
      window.sa_event(eventName, eventData);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
    trackCustomEvent("profile-picture-preview", { userId: user.id });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      // Compress the image
      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      });

      // Get the file name and type
      const uniqueFileName = `${Date.now()}-${compressedFile.name}`;
      const fileType = compressedFile.type;

      // Request a pre-signed URL from the server
      const response = await fetch("/api/s3Upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: uniqueFileName, fileType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate signed URL");
      }

      const { signedUrl, fileUrl } = data;

      // Upload the file directly to S3
      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": fileType },
        body: compressedFile,
      });

      console.log("File uploaded successfully:", fileUrl);

      // Update the avatar URL in your database
      const imageStatus = await updateUserAvatar(user.id, fileUrl);
      if (imageStatus) {
        alert("Profile picture updated successfully!");
        window.location.reload();
      } else {
        console.error("Error updating the profile picture:", imageStatus);
      }
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border-b-2 w-full p-2"
        />

        <button
          className="bg-green-800 py-2 px-4  text-white rounded"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <Spinner size="sm" color="white" /> : <FaUpload />}
        </button>
      </div>
      <div className="flex justify-center items-center pt-2">
        {preview && (
          <img src={preview} alt="Preview" height={160} width={100} />
        )}
      </div>
    </div>
  );
}

export default ProfilePictureUpload;
