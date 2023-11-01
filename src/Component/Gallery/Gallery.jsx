// import React, { useEffect, useState } from 'react';

// const Gallery = () => {
// const [gallery, setGallery] = useState([])

// useEffect(()=>{
//   fetch('Gallery.json')
//   .then(res=>res.json())
//   .then(data=>setGallery(data))
// },[])
// console.log(gallery)
//   return (
// <div>

// </div>
//   );
// };

// export default Gallery;








import React, { useState } from 'react';

const App = () => {
  const initialImages = [
    {
      "id": 1,
      "img": "https://i.ibb.co/dfYDzLS/image-11.jpg",
      "isFeatured": true
    },
    {
      "id": 2,
      "img": "https://i.ibb.co/qRXgJpr/image-10.jpg",
      "isFeatured": false
    },
    {
      "id": 3,
      "img": "https://i.ibb.co/4YRRbsD/image-9.webp",
      "isFeatured": false
    },
    {
      "id": 4,
      "img": "https://i.ibb.co/7bBwDbB/image-8.webp",
      "isFeatured": false
    },
    {
      "id": 5,
      "img": "https://i.ibb.co/kBwZzNS/image-7.webp",
      "isFeatured": false
    },
    {
      "id": 6,
      "img": "https://i.ibb.co/54nZ2rX/image-6.webp",
      "isFeatured": false
    },
    {
      "id": 7,
      "img": "https://i.ibb.co/qYZWXmf/image-5.webp",
      "isFeatured": false
    },
    {
      "id": 8,
      "img": "https://i.ibb.co/x8W596k/image-4.webp",
      "isFeatured": false
    },
    {
      "id": 9,
      "img": "https://i.ibb.co/2kYCQ20/image-3.webp",
      "isFeatured": false
    },
    {
      "id": 10,
      "img": "https://i.ibb.co/dmMwr3k/image-1.webp",
      "isFeatured": false
    }
  ];

  const [images, setImages] = useState(initialImages);
  const [selectedImages, setSelectedImages] = useState([]);
  const [draggedImage, setDraggedImage] = useState(null);
  const [newImages, setNewImages] = useState([]);

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
    setImages(imagesCopy);
    setDraggedImage(null);
  };

  const handleSetFeatureImage = (image) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isFeatured: img === image,
    }));
    setImages(updatedImages);
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
    <div className="flex flex-wrap -mx-4">
      {mergedImages.map((image) => (
        <div
          key={image.id}
          className={`w-full md:w-1/3 px-4 mb-4 ${
            image.isFeatured ? 'lg:w-1/2' : 'lg:w-1/4'
          } ${
            selectedImages.includes(image)
              ? 'border border-blue-500'
              : 'border border-gray-300'
          }`}
          onClick={() => handleImageClick(image)}
          onDragStart={() => handleDragStart(image)}
          onDragOver={() => handleDragOver(image)}
          draggable={true}
        >
          <img
            src={image.img}
            alt={`Image ${image.id}`}
            className="w-[50%] h-52"
          />
          {image.isFeatured && (
            <div className="absolute top-0 right-0 px-2 py-1 bg-blue-500 text-white text-xs">
              Featured
            </div>
          )}
        </div>
      ))}
      <div className="w-full md:w-1/3 px-4 mb-4 lg:w-1/4">
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
        <button
          onClick={() => handleSetFeatureImage(mergedImages[0])}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Set as Feature Image
        </button>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handleDeleteImages}
            className="w-1/2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Selected Images
          </button>
          {selectedImages.length > 0 && (
            <div className="w-1/2 text-right text-sm text-gray-600">
              {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'} selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
