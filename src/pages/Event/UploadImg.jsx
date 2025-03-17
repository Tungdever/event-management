import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const UploadMedia = ({ setShowUpload, setUploadedImages }) => {
  const [images, setImages] = useState([]);
  const [cropImage, setCropImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) return;

    const newImages = files.map((file) => URL.createObjectURL(file));
    setCropImage(newImages[0]); 
    setShowCropper(true);
  };

  const onCropComplete = useCallback(async (croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
    const croppedImg = await getCroppedImg(cropImage, croppedPixels);
    setCroppedPreview(croppedImg); 
  }, [cropImage]);

  const getCroppedImg = async (imageSrc, cropArea) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleSaveCrop = async () => {
    if (!cropImage || !croppedAreaPixels) return;
    const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels);
    setImages([...images, croppedImg]);
    setUploadedImages([...images, croppedImg]); 
    setShowCropper(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4 ">
      <h1 className="text-2xl font-semibold mb-4">Add images</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Images</h2>
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
            accept="image/jpeg, image/png"
            multiple
            className="hidden"
            id="upload-input"
            onChange={handleImageUpload}
          />
          <label htmlFor="upload-input" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer">
            Upload Images
          </label>
          
        </div>
        <p className="text-sm text-gray-600">
          • Recommended image size: 2160 x 1080px • Maximum file size: 10MB •
          Supported image files: JPEG, PNG
        </p>
        <div className="flex gap-2 mt-4">
          {images.map((img, index) => (
            <img key={index} src={img} alt="Uploaded" className="w-24 h-24 object-cover rounded-md" />
          ))}
        </div>
      </div>

      <button onClick={() => setShowUpload(false)} className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4">
        Complete
      </button>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-5xl min-h-3xl w-full flex">
            {/* Khu vực Crop */}
            <div className="w-2/3 pr-4 border-r">
              <h2 className="text-lg font-semibold mb-4">Adjust Image</h2>
              <div className="relative w-full h-[400px]">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={2 / 1}
                  cropShape="rect"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            </div>

            {/* Khu vực Xem trước */}
            <div className="w-1/3 pl-4">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="flex flex-col items-center gap-4">
                {croppedPreview && (
                  <>
                    <img src={croppedPreview} alt="Square Preview" className="w-36 h-36 object-cover rounded-md border" />
                    <img src={croppedPreview} alt="Rectangle Preview" className="w-64 h-32 object-cover rounded-md border" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex gap-4">
            <button onClick={() => setShowCropper(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
            <button onClick={handleSaveCrop} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

const UploadedImagesSlider = ({ images }) => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false}>
      {images.map((img, index) => (
        <div key={index} className="relative max-w-[710px] min-h-[400px] mb-4">
          <img src={img} alt={`Uploaded ${index}`} className="w-full h-[400px] object-cover" />
        </div>
      ))}
    </Carousel>
  );
};

const UploadContainer = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <div>
      {!showUpload ? (
        uploadedImages.length > 0 ? (
          <UploadedImagesSlider images={uploadedImages} />
        ) : (
          <div
            className="relative bg-gray-200 rounded-lg overflow-hidden mb-6 max-w-[710px] min-h-[400px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowUpload(true)}
          >
            <img
              src="https://storage.googleapis.com/a1aa/image/oFssrRGOqYsjeanal5Ggc6TQow520FnOxiqapc7K5xs.jpg"
              alt="A busy event with people socializing in a large room"
              className="w-full h-[400px] object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-75 p-6 rounded-lg text-center">
                              <i className="fas fa-upload text-2xl text-blue-500 mb-2"></i>
                              <p className="text-blue-500">Upload photos</p>
                            </div>
            </div>
          </div>

        )
      ) : (
        <UploadMedia setShowUpload={setShowUpload} setUploadedImages={setUploadedImages} />
      )}
    </div>
  );
};

export default UploadContainer;

// Hàm tạo ảnh từ URL để vẽ lên canvas
const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
