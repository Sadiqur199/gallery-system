import React, { useEffect, useState } from "react";
import './Gallery.css'
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);

  useEffect(() => {
    fetch("Gallery.json")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now(),
          img: e.target.result,
          isFeatured: false,
        };
        setNewImages([...newImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleDelete = () => {
    const updatedImages = images.filter((img) => !selectedImages.includes(img));
    setImages(updatedImages);
    setSelectedImages([]);
  };
  const handleDragStart = (image) => {
    setDraggedImage(image);
  };

  const handleDragOver = (image) => {
    if (draggedImage === null || draggedImage === image) return;

    const imagesCopy = [...images];
    const draggedIndex = imagesCopy.findIndex((img) => img === draggedImage);
    const targetIndex = imagesCopy.findIndex((img) => img === image);

    [imagesCopy[draggedIndex], imagesCopy[targetIndex]] = [
      imagesCopy[targetIndex],
      imagesCopy[draggedIndex],
    ];

    imagesCopy[draggedIndex].isFeatured = false;
    imagesCopy[targetIndex].isFeatured = true;

    setImages(imagesCopy);
    setDraggedImage(null);
  };
  const margImages = [...images, ...newImages];

  return (
    <div className="w-full bg-gray-100">
      <div className="flex justify-between p-5">
        <div>
          {selectedImages.length > 0 ? (
            <div className="font-semibold text-xl">
              {selectedImages.length}
              {selectedImages.length === 1 ? "-image" : "-images"} selected
            </div>
          ) : (
            <div className="text-bold text-2xl text-gray-500">Gallery</div>
          )}
        </div>
        <div>
          {selectedImages.length > 0 && (
            <button className="btn btn-outline bg-red-700 text-white hover:bg-red-700 border-none" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>

      <hr />

      <div className="flex flex-wrap mt-5">
        {margImages.map((images, index) => (
          <div
            key={images.id}
            className={`image-container m-5 lg:h-[150] rounded ${
              images.isFeatured
                ? "lg:w-[400px] lg:h-[350px] sm:h-[300px]"
                : "lg:w-[292px] lg:h-[290px]"
            } ${
              selectedImages.includes(images)
                ? "border border-none border-red-500"
                : "border  border-gray-300"
            } ${index === 0 ? "first-image" : ""}`}
            onClick={() => handleImageClick(images)}
            onDragStart={() => handleDragStart(images)}
            onDragOver={() => handleDragOver(images)}
            draggable={true}
          >
            <input
              type="checkbox"
              className="images-checkbox"
              checked={selectedImages.includes(images)}
              onChange={() => handleImageClick(images)}
            />

            <img
              src={images.img}
              alt={`Image ${images.id}`}
              style={{
                filter: selectedImages.includes(images) ? "blur(3px)" : "none",
              }}
              className={`${
                index === 0 ? "h-[350px] w-[500px]" : "h-auto w-[400px]"
              } transition-transform transform hover:scale-105 hover:filter hover:brightness-90`}
            />
          </div>
        ))}

        <div className="w-full md:w-1/3 px-4 lg:p-0 p-5 lg:mt-24 lg:w-1/4">
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            onChange={handleImageUpload}
            className="hidden"
          />

          <label
            htmlFor="image-upload"
            className="w-full bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add Image
          </label>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
