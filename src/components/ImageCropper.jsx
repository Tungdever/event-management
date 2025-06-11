
import React, { useState, useEffect, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio }) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState({
    unit: "px",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspect: aspectRatio,
  });
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) {
      setHasError(true);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: t('imageCropper.error'),
        text: t('imageCropper.errorInvalidSrc'),
      });
      onCancel();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      
      // Khởi tạo vùng cắt dựa trên kích thước gốc của ảnh
      const maxWidth = Math.min(img.naturalWidth, aspectRatio === 1 ? 300 : 940);
      const maxHeight = maxWidth / aspectRatio;
      const targetWidth = Math.min(maxWidth, img.naturalWidth);
      const targetHeight = Math.min(maxHeight, img.naturalHeight);
      
      setCrop({
        unit: "px",
        x: (img.naturalWidth - targetWidth) / 2,
        y: (img.naturalHeight - targetHeight) / 2,
        width: targetWidth,
        height: targetHeight,
        aspect: aspectRatio,
      });
      
      setIsLoading(false);
      console.log("Image loaded:", {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        targetWidth,
        targetHeight,
        imageSrc,
      });
    };
    img.onerror = (error) => {
      console.error("Failed to load image:", { imageSrc, error });
      setHasError(true);
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: t('imageCropper.error'),
        text: t('imageCropper.errorLoadImage'),
      });
      onCancel();
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, aspectRatio, onCancel, t]);

  const getCroppedImg = (imageSrc, crop, image) => {
    return new Promise((resolve) => {
      if (!image || !crop.width || !crop.height) {
        Swal.fire({
          icon: "error",
          title: t('imageCropper.error'),
          text: t('imageCropper.errorInvalidCrop'),
        });
        resolve(null);
        return;
      }

      const pixelCrop = {
        x: Math.max(0, Math.min(crop.x, image.naturalWidth)),
        y: Math.max(0, Math.min(crop.y, image.naturalHeight)),
        width: Math.min(crop.width, image.naturalWidth - crop.x),
        height: Math.min(crop.height, image.naturalHeight - crop.y),
      };

      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";

      if (
        pixelCrop.width <= 0 ||
        pixelCrop.height <= 0 ||
        pixelCrop.x + pixelCrop.width > image.naturalWidth ||
        pixelCrop.y + pixelCrop.height > image.naturalHeight
      ) {
        Swal.fire({
          icon: "error",
          title: t('imageCropper.error'),
          text: t('imageCropper.errorInvalidCropArea'),
        });
        resolve(null);
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            Swal.fire({
              icon: "error",
              title: t('imageCropper.error'),
              text: t('imageCropper.errorCreateCroppedImage'),
            });
            resolve(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          console.log("Cropped image dimensions:", {
            width: pixelCrop.width,
            height: pixelCrop.height,
          });
          resolve({ blob, url });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (imageSrc && crop.width && crop.height && image) {
      const croppedImage = await getCroppedImg(imageSrc, crop, image);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    }
  };

  const handleUseOriginal = async () => {
    try {
      const response = await fetch(imageSrc, { mode: "cors" });
      const blob = await response.blob();
      if (!blob) {
        Swal.fire({
          icon: "error",
          title: t('imageCropper.error'),
          text: t('imageCropper.errorRetrieveOriginal'),
        });
        return;
      }
      const originalImage = { blob, url: imageSrc };
      onCropComplete(originalImage);
    } catch (error) {
      console.error("Failed to retrieve original image:", error);
      Swal.fire({
        icon: "error",
        title: t('imageCropper.error'),
        text: t('imageCropper.errorRetrieveOriginal'),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-[1000px] min-h-[400px] max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="mb-4 text-xl font-semibold">{t('imageCropper.cropImage')}</h2>
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <p>{t('imageCropper.loadingImage')}</p>
          </div>
        ) : hasError ? (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <p className="text-red-500">{t('imageCropper.errorLoadImage')}</p>
          </div>
        ) : image ? (
          <div className="relative flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
            <div
              className="relative border border-gray-300"
              style={{
                maxWidth: `${Math.min(imageDimensions.width, 940)}px`,
                maxHeight: `${Math.min(imageDimensions.height, 530)}px`,
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`,
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                aspect={aspectRatio}
                className="absolute inset-0"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop"
                  className="object-none max-w-full max-h-full"
                  crossOrigin="anonymous"
                  onLoad={(e) => {
                    console.log("Cropper image dimensions:", {
                      naturalWidth: e.target.naturalWidth,
                      naturalHeight: e.target.naturalHeight,
                      displayWidth: e.target.width,
                      displayHeight: e.target.height,
                    });
                  }}
                  onError={(e) => {
                    console.error("Image failed to render in cropper:", e);
                    setHasError(true);
                  }}
                />
              </ReactCrop>
            </div>
            
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <p className="text-red-500">{t('imageCropper.errorLoadImage')}</p>
          </div>
        )}
        <div className="sticky bottom-0 flex justify-end pt-2 mt-4 space-x-2 bg-white">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md"
          >
            {t('imageCropper.cancel')}
          </button>
          <button
            onClick={handleUseOriginal}
            className="px-4 py-2 text-white bg-green-500 rounded-md"
            disabled={isLoading || hasError}
          >
            {t('imageCropper.useOriginal')}
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 text-white bg-blue-500 rounded-md"
            disabled={isLoading || hasError || !crop.width || !crop.height}
          >
            {t('imageCropper.crop')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
