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
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImage(img);
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      const targetWidth = Math.min(img.naturalWidth, aspectRatio === 1 ? 300 : 940);
      const targetHeight = targetWidth / aspectRatio;
      setCrop({
        unit: "px",
        x: (img.naturalWidth - targetWidth) / 2,
        y: (img.naturalHeight - targetHeight) / 2,
        width: targetWidth,
        height: targetHeight,
        aspect: aspectRatio,
      });
    };
    img.onerror = () => {
      Swal.fire({
        icon: "error",
        title: t('imageCropper.error'),
        text: t('imageCropper.errorLoadImage'),
      });
      onCancel();
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

      const targetWidth = aspectRatio === 1 ? 300 : 940;
      const targetHeight = targetWidth / aspectRatio;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
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
        targetWidth,
        targetHeight
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
      Swal.fire({
        icon: "error",
        title: t('imageCropper.error'),
        text: t('imageCropper.errorRetrieveOriginal'),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{t('imageCropper.cropImage')}</h2>
        {image ? (
          <div className="relative flex-1 overflow-auto">
            <div
              className="relative w-full"
              style={{
                aspectRatio: aspectRatio,
                maxHeight: "70vh",
                maxWidth: "100%",
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
                  className="w-full h-full object-contain"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            </div>
          </div>
        ) : (
          <p>{t('imageCropper.loadingImage')}</p>
        )}
        <div className="flex justify-end mt-4 space-x-2 sticky bottom-0 bg-white pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            {t('imageCropper.cancel')}
          </button>
          <button
            onClick={handleUseOriginal}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {t('imageCropper.useOriginal')}
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {t('imageCropper.crop')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;