import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const UploadMedia = ({ setShowUpload, uploadedImages, setUploadedImages }) => {
  const [images, setImages] = useState(uploadedImages.map(file => ({ file, url: URL.createObjectURL(file) })) || []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) {
      alert("Bạn chỉ có thể upload tối đa 3 ảnh.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // Chỉ dùng URL để hiển thị
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setUploadedImages(updatedImages.map((img) => img.file)); // Truyền File objects
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, index) => index !== indexToDelete);
    setImages(updatedImages);
    setUploadedImages(updatedImages.map((img) => img.file));
    if (updatedImages.length === 0) {
      setShowUpload(false);
    }
  };

  const handleComplete = () => {
    setUploadedImages(images.map((img) => img.file));
    setShowUpload(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <h1 className="text-2xl font-semibold mb-4">Thêm ảnh</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ảnh</h2>
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
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            id="upload-input"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="upload-input"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer"
          >
            Tải ảnh lên
          </label>
        </div>
        <p className="text-sm text-gray-600">
          • Kích thước đề xuất: 2160 x 1080px • Dung lượng tối đa: 10MB • Định dạng hỗ trợ: JPEG, PNG
        </p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt="Uploaded"
                className="w-24 h-24 object-cover rounded-md"
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

      <button
        onClick={handleComplete}
        className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4"
      >
        Hoàn tất
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
              className="w-full h-[400px] object-cover"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const UploadContainer = ({ uploadedImages, setUploadedImages }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleEditImages = () => {
    setShowUpload(true);
  };

  return (
    <div>
      {!showUpload ? (
        uploadedImages.length > 0 ? (
          <UploadedImagesSlider
            images={uploadedImages.map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }))}
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
                <p className="text-blue-500">Tải ảnh lên</p>
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