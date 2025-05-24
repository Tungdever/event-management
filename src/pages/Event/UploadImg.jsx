import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Swal from "sweetalert2";
import ImageCropper from "../../components/ImageCropper";

const UploadMedia = ({ setShowUpload, uploadedImages, setUploadedImages }) => {
  const getCloudinaryUrl = (publicId) =>
    publicId ? `https://res.cloudinary.com/dho1vjupv/image/upload/${publicId}` : "";

  const initializeImages = (images) => {
    return images.map((item) => {
      if (item instanceof File || item instanceof Blob) {
        return { file: item, url: URL.createObjectURL(item) };
      } else if (typeof item === "string") {
        return { file: null, url: item.startsWith("http") ? item : getCloudinaryUrl(item) };
      }
      return null;
    }).filter((img) => img !== null);
  };

  const [images, setImages] = useState(initializeImages(uploadedImages || []));
  const [imageToCrop, setImageToCrop] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "You can only upload up to 3 photos.",
      });
      return;
    }

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Image size exceeds 10MB.",
      });
      return;
    }

    // Validate image by loading it
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      console.log("Uploaded image:", {
        name: file.name,
        type: file.type,
        size: file.size,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
      if (img.naturalWidth > 1200 || img.naturalHeight > 1200) {
        Swal.fire({
          icon: "info",
          title: "Large Image",
          text: "The image is large (> 1200px). You may need to scroll to view the entire image in the cropper.",
        });
      }
      setImageToCrop(URL.createObjectURL(file));
    };
    img.onerror = () => {
      console.error("Failed to load uploaded image:", file.name);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid image file. Please try another image.",
      });
    };
  };

  const handleCropComplete = (croppedImage) => {
    console.log("Received cropped image in UploadMedia:", croppedImage);
    if (!croppedImage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to crop image. Please try again or use a different image.",
      });
      return;
    }
    const newImage = { file: croppedImage.blob, url: croppedImage.url };
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    setUploadedImages(updatedImages.map((img) => img.file || img.url));
    setImageToCrop(null);
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);
    setImages(updatedImages);
    setUploadedImages(updatedImages.map((img) => img.file || img.url));
    if (updatedImages.length === 0) {
      setShowUpload(false);
    }
  };

  const handleComplete = () => {
    setUploadedImages(images.map((img) => img.file || img.url));
    setShowUpload(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <h1 className="text-2xl font-semibold mb-4">Add image</h1>

      {imageToCrop ? (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspectRatio={940 / 530}
        />
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mb-2">
            <img
              src="https://mybic.vn/uploads/news/default/no-image.png"
              alt="Placeholder"
              className="mb-4"
              width="160"
              height="120"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="upload-input"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="upload-input"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer"
            >
              Upload Image
            </label>
          </div>
          <p className="text-sm text-gray-600">
            • Proposed size: 940 x 530px • Maximum capacity: 10MB • Support format: Any image
          </p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url}
                  alt="Uploaded"
                  className="w-24 h-24 object-contain rounded-md"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleComplete}
        className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
      >
        Complete
      </button>
    </div>
  );
};

const UploadedImagesSlider = ({ images, onEdit }) => {
  return (
    <div className="cursor-pointer" onClick={onEdit}>
      <Carousel autoPlay infiniteLoop showThumbs={false}>
        {images.map((img, index) => (
          <div key={index} className="relative max-w-[710px] min-h-[400px] mb-4">
            <img
              src={img.url}
              alt={`Uploaded ${index}`}
              className="w-full h-[400px] object-contain"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const UploadContainer = ({ uploadedImages, setUploadedImages }) => {
  const [showUpload, setShowUpload] = useState(false);

  const getCloudinaryUrl = (publicId) =>
    publicId ? `https://res.cloudinary.com/dho1vjupv/image/upload/${publicId}` : "";

  const initializeImages = (images) => {
    return images.map((item) => {
      if (item instanceof File || item instanceof Blob) {
        return { file: item, url: URL.createObjectURL(item) };
      } else if (typeof item === "string") {
        return { file: null, url: item.startsWith("http") ? item : getCloudinaryUrl(item) };
      }
      return null;
    }).filter((img) => img !== null);
  };

  const handleEditImages = () => {
    setShowUpload(true);
  };

  return (
    <div>
      {!showUpload ? (
        uploadedImages.length > 0 ? (
          <UploadedImagesSlider
            images={initializeImages(uploadedImages)}
            onEdit={handleEditImages}
          />
        ) : (
          <div
            className="relative bg-gray-200 rounded-lg overflow-hidden mb-6 max-w-[710px] min-h-[400px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowUpload(true)}
          >
            <img
              src="https://storage.googleapis.com/a1aa/image/oFssrRGOqYsjeanal5Ggc6TQow520FnOxiqapc7K5xs.jpg"
              alt="Sự kiện đông người"
              className="w-full h-[400px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-75 p-6 rounded-lg text-center">
                <i className="fas fa-upload text-2xl text-blue-500 mb-2"></i>
                <p className="text-blue-500">Upload Images</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <UploadMedia
          setShowUpload={setShowUpload}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )}
    </div>
  );
};

export default UploadContainer;