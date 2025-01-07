import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayAllImages = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch all images from the backend
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://backend-upqj.onrender.com/images');
        console.log(response);
        // Assuming response contains an array of image metadata (with id, caption, etc.)
        const imagesWithBase64 = await Promise.all(response.data.map(async (image) => {
          const imageData = await fetchImageData(image.id); // Fetch image by ID
          return { ...image, imageUrl: imageData };
        }));

        setImages(imagesWithBase64);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const fetchImageData = async (imageId) => {
    try {
      const response = await axios.get(`http://localhost:5000/image/${imageId}`, {
        responseType: 'arraybuffer',  // Receive binary data
      });

      // Convert binary data to base64 string
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      
      // Assuming MIME type is set as part of response (like image/jpeg, image/png, etc.)
      return `data:image/jpeg;base64,${base64Image}`; // Change MIME type if needed
    } catch (error) {
      console.error('Error fetching image data:', error);
      return '';
    }
  };

  return (
    <div className="container">
      <h1>All Uploaded Images</h1>
      <div className="row">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div className="col-md-4" key={index}>
              <div className="card mb-4">
                <img
                  src={image.imageUrl}
                  className="card-img-top"
                  alt={image.caption}
                  style={{ width: '100%', height: 'auto' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{image.caption}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No images to display.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayAllImages;
