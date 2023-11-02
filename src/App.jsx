import React, { useEffect, useState } from "react";
import './App.css'

const App = () => {



  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);
  const [newImages, setNewImages] = useState([]);

  useEffect(()=>{
    fetch('Gallery.json')
    .then(res=>res.json())
    .then(data=>setImages(data))
  },[])

  const handleImageClick = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
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

  const handleDeleteImages = () => {
    const updatedImages = images.filter((img) => !selectedImages.includes(img));
    setImages(updatedImages);
    setSelectedImages([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now(),
          img: event.target.result,
          isFeatured: false,
        };
        setNewImages([...newImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const mergedImages = [...images, ...newImages];
  

  return (
    <div className="w-full bg-gray-100">
      <div className="flex justify-between p-5">
        <div>
          {selectedImages.length > 0 ? (
            <div className="w-full text-sm text-gray-600">
              {selectedImages.length}{" "}
              <input
              type="checkbox"
              className="images-checkbox"
              checked={selectedImages.includes()}
              onChange={() => handleImageClick()}
            />
              {selectedImages.length === 1 ? "image" : "images"} selected
            </div>
          ) : (
            <div className="w-1/2 text-bold text-2xl text-gray-600">
              Gallery
            </div>
          )}
        </div>
        <div className="w-full md:w-full px-4 mb-4 lg:w-1/4">
          {selectedImages.length > 0 && (
            <button
              onClick={handleDeleteImages}
              className="bg-red-500 text-white px-2 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <hr />

      <div className="flex flex-wrap mt-5">
        {mergedImages.map((image,index) => (
          <div
            key={image.id}
            className={`image-container m-5 lg:h-[150px] rounded ${
              image.isFeatured ? "lg:w-[400px] lg:h-[350px] sm:h-[300px]" : "lg:w-[292px] lg:h-[290px]"
            } ${
              selectedImages.includes(image)
                ? "border border-red-500"
                : "border border-gray-500"
            }${index === 0 ? 'first-image' : ''}`}
            onClick={() => handleImageClick(image)}
            onDragStart={() => handleDragStart(image)}
            onDragOver={() => handleDragOver(image)}
            draggable={true}
          >
             <input
              type="checkbox"
              className="images-checkbox"
              checked={selectedImages.includes(image)}
              onChange={() => handleImageClick(image)}
            />
            <img
              src={image.img}
              alt={`Image ${image.id}`}
              style={{
                filter: selectedImages.includes(image) ? 'blur(2px)' : 'none',
              }}
              className={`${
                index === 0 ? 'h-[350px] w-[500px]' : 'h-auto w-[400px]'
              } transition-transform transform hover:scale-105 hover:filter hover:brightness-90`}
            />
          </div>
        ))}
        <div className="w-full md:w-1/3 px-4 lg:p-0 p-5 lg:mt-24 lg:w-1/4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
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

export default App;
