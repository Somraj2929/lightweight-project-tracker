import React, { useState } from "react";
import S3 from "react-s3";
import imageCompression from "browser-image-compression";
import s3Config from "@/app/config/s3Config";
import { updateUserAvatar } from "@/app/helper/apiHelpers";
import { FaUpload } from "react-icons/fa6";
import { Spinner } from "@nextui-org/react";

function ProfilePictureUpload({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
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

      // Ensure unique file name by appending timestamp
      const uniqueFileName = `${Date.now()}-${compressedFile.name}`;

      // Upload the compressed image to S3
      const s3Response = await S3.uploadFile(
        new File([compressedFile], uniqueFileName),
        s3Config
      );
      const avatarUrl = s3Response.location;
      console.log("Avatar URL:", avatarUrl);
      // Update the avatar URL in MongoDB using the helper function
      const imageStatus = await updateUserAvatar(user.id, avatarUrl);
      if (imageStatus) {
        alert("Profile picture updated successfully!");
        window.location.reload();
      } else {
        console.error("Error updating the profile picture:", imageStatus);
      }

      //alert("Profile picture updated successfully!");
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
