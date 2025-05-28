// CreateListingPopup.jsx
import React, { useState } from 'react';
import { FaTimes, FaStar, FaRegStar, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import './CreateListingPopup.css';

const CreateListingPopup = ({ onClose, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'House',
    status: 'For Sale',
    label: '',
    price: '',
    pricePlaceholder: false,
    secondPrice: '',
    afterPrice: '',
    pricePrefix: '',
    bedrooms: '',
    rooms: '',
    bathrooms: '',
    areaSize: '',
    sizePostfix: 'sqft',
    landArea: '',
    landAreaPostfix: 'sqft',
    propertyId: '',
    yearBuilt: '',
    address: '',
    country: '',
    state: '',
    city: '',
    area: '',
    zipCode: '',
      latitude: '18.562061287384868',
    longitude: '73.9148964152217',
    additionalDetails: [{ title: '', value: '' }],
    features: [],
    floorPlans: [{
      planTitle: '',
      bedrooms: '',
      bathrooms: '',
      price: '',
      planSize: '',
      planImage: null,
      description: ''
    }],
    subListings: [{
      title: '',
      bedrooms: '',
      bathrooms: '',
      propertySize: '',
      price: '',
      propertyType: '',
      availabilityDate: ''
    }],
    privateNote: '',
    hasAccount: true,
    username: '',
    phone: '',
    email: ''
  });

  const [images, setImages] = useState([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
   const [mapPreview, setMapPreview] = useState(
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.9148964152217!3d18.562061287384868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1625079322417!5m2!1sen!2sin'
  );
  const propertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Land', 'Commercial'];
  const propertyStatuses = ['For Sale', 'For Rent', 'Sold', 'Rented'];
  const propertyLabels = ['', 'Featured', 'New', 'Hot Deal'];
  const featureOptions = ['Air Conditioning', 'Gym', 'Lawn', 'Swimming Pool', 'WiFi', 'Window Coverings'];

  // Handle map coordinates change
  const handleMapCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update map preview when both coordinates are entered
    if ((name === 'latitude' || name === 'longitude') && formData.latitude && formData.longitude) {
      setMapPreview(
        `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d${formData.longitude}!3d${formData.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1625079322417!5m2!1sen!2sin`
      );
    }
  };

  // Update the handleMapClick function
  const handleMapClick = () => {
    // For demo, we'll use fixed coordinates (same as Phoenix Marketcity Pune)
    const lat = '18.562061287384868';
    const lng = '73.9148964152217';
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    
    setMapPreview(
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588856342!2d73.9148964152217!3d18.562061287384868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPhoenix%20Marketcity%20Pune!5e0!3m2!1sen!2sin!4v1625079322417!5m2!1sen!2sin'
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 50) {
      alert('You can upload maximum 50 images');
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isFeatured: false
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
    
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
  };

  const setFeatured = (index) => {
    setFeaturedImageIndex(index);
  };

  const handleAdditionalDetailChange = (index, field, value) => {
    const newDetails = [...formData.additionalDetails];
    newDetails[index][field] = value;
    setFormData(prev => ({ ...prev, additionalDetails: newDetails }));
  };

  const addAdditionalDetail = () => {
    setFormData(prev => ({
      ...prev,
      additionalDetails: [...prev.additionalDetails, { title: '', value: '' }]
    }));
  };

  const removeAdditionalDetail = (index) => {
    const newDetails = [...formData.additionalDetails];
    newDetails.splice(index, 1);
    setFormData(prev => ({ ...prev, additionalDetails: newDetails }));
  };

  const handleFloorPlanChange = (index, field, value) => {
    const newFloorPlans = [...formData.floorPlans];
    newFloorPlans[index][field] = value;
    setFormData(prev => ({ ...prev, floorPlans: newFloorPlans }));
  };

  const addFloorPlan = () => {
    setFormData(prev => ({
      ...prev,
      floorPlans: [...prev.floorPlans, {
        planTitle: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        pricePostfix: '',
        planSize: '',
        planImage: null,
        description: ''
      }]
    }));
  };

  const removeFloorPlan = (index) => {
    const newFloorPlans = [...formData.floorPlans];
    if (newFloorPlans[index].planImage) {
      URL.revokeObjectURL(newFloorPlans[index].planImage.preview);
    }
    newFloorPlans.splice(index, 1);
    setFormData(prev => ({ ...prev, floorPlans: newFloorPlans }));
  };

  const handleFloorPlanImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const newFloorPlans = [...formData.floorPlans];
    // Clean up previous image if exists
    if (newFloorPlans[index].planImage) {
      URL.revokeObjectURL(newFloorPlans[index].planImage.preview);
    }
    
    newFloorPlans[index].planImage = {
      file,
      preview: URL.createObjectURL(file)
    };
    setFormData(prev => ({ ...prev, floorPlans: newFloorPlans }));
  };

  const handleSubListingChange = (index, field, value) => {
    const newSubListings = [...formData.subListings];
    newSubListings[index][field] = value;
    setFormData(prev => ({ ...prev, subListings: newSubListings }));
  };

  const addSubListing = () => {
    setFormData(prev => ({
      ...prev,
      subListings: [...prev.subListings, {
        title: '',
        bedrooms: '',
        bathrooms: '',
        propertySize: '',
        sizePostfix: '',
        price: '',
        pricePostfix: '',
        propertyType: '',
        availabilityDate: ''
      }]
    }));
  };

  const removeSubListing = (index) => {
    const newSubListings = [...formData.subListings];
    newSubListings.splice(index, 1);
    setFormData(prev => ({ ...prev, subListings: newSubListings }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => {
      if (prev.features.includes(feature)) {
        return {
          ...prev,
          features: prev.features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...prev.features, feature]
        };
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (!formData.areaSize) newErrors.areaSize = 'Area size is required';
    if (isNaN(formData.areaSize)) newErrors.areaSize = 'Area size must be a number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    
    // Validate floor plans
    formData.floorPlans.forEach((plan, index) => {
      if (plan.planTitle && !plan.planImage) {
        newErrors[`floorPlanImage-${index}`] = 'Plan image is required';
      }
    });
    
    // Validate account info if no account
    if (!formData.hasAccount) {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const formDataToSend = new FormData();
      
      // Append all simple fields
      const simpleFields = [
        'title', 'content', 'type', 'status', 'label', 'price', 'pricePlaceholder',
        'secondPrice', 'afterPrice', 'pricePrefix', 'bedrooms', 'rooms', 'bathrooms',
        'areaSize', 'sizePostfix', 'landArea', 'landAreaPostfix', 'garages', 'garageSize',
        'propertyId', 'yearBuilt', 'address', 'country', 'state', 'city', 'area', 'zipCode',
        'privateNote', 'hasAccount', 'username', 'phone', 'email'
      ];
      
      simpleFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formDataToSend.append(field, formData[field]);
        }
      });
      
      // Append complex fields as JSON
      formDataToSend.append('additionalDetails', JSON.stringify(formData.additionalDetails));
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('floorPlans', JSON.stringify(formData.floorPlans.map(plan => ({
        ...plan,
        planImage: null // Don't send the image object in JSON
      }))));
      formDataToSend.append('subListings', JSON.stringify(formData.subListings));
      
      // Append main images
      images.forEach((image, index) => {
        formDataToSend.append('images', image.file);
        if (index === featuredImageIndex) {
          formDataToSend.append('featuredImageIndex', index);
        }
      });
      
      // Append floor plan images
      formData.floorPlans.forEach((plan, index) => {
        if (plan.planImage && plan.planImage.file) {
          formDataToSend.append(`floorPlanImages`, plan.planImage.file);
          formDataToSend.append(`floorPlanIndexes`, index); // To know which plan the image belongs to
        }
      });
      
      // Add owner information
      if (currentUser) {
        formDataToSend.append('ownerId', currentUser._id || currentUser.id);
        formDataToSend.append('ownerName', `${currentUser.firstName} ${currentUser.lastName}`);
        formDataToSend.append('ownerEmail', currentUser.email);
      } else {
        formDataToSend.append('ownerName', formData.username);
        formDataToSend.append('ownerEmail', formData.email);
        formDataToSend.append('ownerPhone', formData.phone);
      }
      
      const response = await axios.post('/api/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        setSuccessMessage('Property listed successfully!');
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(response.data.message || 'Failed to create listing. Please try again.');
      }
      
    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Failed to create listing. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="create-listing-popup">
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content">
        <div className="popup-header">
          <h2>Create New Property Listing</h2>
          <button className="close-popup" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="popup-body">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
          
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <div className="form-group">
                <label>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter your property title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="content"
                  placeholder="Describe your property"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    {propertyStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Label</label>
                  <select name="label" value={formData.label} onChange={handleChange}>
                    {propertyLabels.map(label => (
                      <option key={label || 'none'} value={label}>{label || 'None'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="form-section">
              <h3 className="section-title">Price</h3>
              
              <div className="form-group">
                <label>Sale or Rent Price *</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Enter the price"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>
              
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="pricePlaceholder"
                  name="pricePlaceholder"
                  checked={formData.pricePlaceholder}
                  onChange={handleChange}
                />
                <label htmlFor="pricePlaceholder">Enable Price Placeholder</label>
              </div>
              
              <div className="form-group">
                <label>Second Price (Optional)</label>
                <input
                  type="text"
                  name="secondPrice"
                  placeholder="Enter the second price"
                  value={formData.secondPrice}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>After The Price</label>
                <input
                  type="text"
                  name="afterPrice"
                  placeholder="Enter the after price (e.g., Monthly)"
                  value={formData.afterPrice}
                  onChange={handleChange}
                />
              </div>
              
              {/* <div className="form-group">
                <label>Price Prefix</label>
                <input
                  type="text"
                  name="pricePrefix"
                  placeholder="Enter the price prefix (e.g., Start from)"
                  value={formData.pricePrefix}
                  onChange={handleChange}
                />
              </div> */}
            </div>
            
            {/* Media Section */}
            <div className="form-section">
              <h3 className="section-title">Media</h3>
              <div className={`image-upload-container ${errors.images ? 'error-border' : ''}`}>
                <label htmlFor="property-images" className="upload-label">
                  <div className="upload-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5L11.59 6.41L13.17 8H5V10H13.17L11.58 11.59L13 13L17 9L13 5Z" fill="#3498db"/>
                    </svg>
                  </div>
                  <div className="upload-text">
                    <p>Drag and drop images here or click to browse</p>
                    <span>Supports JPG, PNG - Max 50 images</span>
                  </div>
                  <span className="image-count">{images.length} / 50</span>
                </label>
                <input
                  id="property-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                
                {errors.images && <span className="error-text">{errors.images}</span>}
                
                {images.length > 0 && (
                  <div className="image-preview-container">
                    {images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image.preview} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          <FaTimes />
                        </button>
                        <button
                          type="button"
                          className={`feature-toggle ${featuredImageIndex === index ? 'featured' : ''}`}
                          onClick={() => setFeatured(index)}
                        >
                          {featuredImageIndex === index ? <FaStar /> : <FaRegStar />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Details Section */}
            <div className="form-section">
              <h3 className="section-title">Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    placeholder="Enter number of bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Rooms</label>
                  <input
                    type="number"
                    name="rooms"
                    placeholder="Enter number of rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    placeholder="Enter number of bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Area Size *</label>
                  <input
                    type="number"
                    name="areaSize"
                    placeholder="Enter property area size"
                    value={formData.areaSize}
                    onChange={handleChange}
                    className={errors.areaSize ? 'error' : ''}
                    min="0"
                  />
                  {errors.areaSize && <span className="error-text">{errors.areaSize}</span>}
                </div>
                
                {/* <div className="form-group">
                  <label>Size Postfix</label>
                  <input
                    type="text"
                    name="sizePostfix"
                    placeholder="sqft"
                    value={formData.sizePostfix}
                    onChange={handleChange}
                  />
                </div> */}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Land Area</label>
                  <input
                    type="number"
                    name="landArea"
                    placeholder="Enter property Land Area"
                    value={formData.landArea}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                {/* <div className="form-group">
                  <label>Land Area Size Postfix</label>
                  <input
                    type="text"
                    name="landAreaPostfix"
                    placeholder="sqft"
                    value={formData.landAreaPostfix}
                    onChange={handleChange}
                  />
                </div> */}
              </div>
              
              
              <div className="form-row">
                <div className="form-group">
                  <label>Property ID</label>
                  <input
                    type="text"
                    name="propertyId"
                    placeholder="Enter property ID (e.g., HZ-01)"
                    value={formData.propertyId}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    placeholder="Enter year built"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
            
            {/* Floor Plans Section */}
            <div className="form-section">
              <h3 className="section-title">Floor Plans</h3>
              
              {formData.floorPlans.map((plan, index) => (
                <div key={index} className="floor-plan-section">
                  <div className="form-group">
                    <label>Plan Title</label>
                    <input
                      type="text"
                      placeholder="Enter the plan title"
                      value={plan.planTitle}
                      onChange={(e) => handleFloorPlanChange(index, 'planTitle', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bedrooms</label>
                      <input
                        type="number"
                        placeholder="Enter number of bedrooms"
                        value={plan.bedrooms}
                        onChange={(e) => handleFloorPlanChange(index, 'bedrooms', e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Bathrooms</label>
                      <input
                        type="number"
                        placeholder="Enter number of bathrooms"
                        value={plan.bathrooms}
                        onChange={(e) => handleFloorPlanChange(index, 'bathrooms', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="text"
                        placeholder="Enter the price"
                        value={plan.price}
                        onChange={(e) => handleFloorPlanChange(index, 'price', e.target.value)}
                      />
                    </div>
                    
                    {/* <div className="form-group">
                      <label>Price Postfix</label>
                      <input
                        type="text"
                        placeholder="Enter the price postfix"
                        value={plan.pricePostfix}
                        onChange={(e) => handleFloorPlanChange(index, 'pricePostfix', e.target.value)}
                      />
                    </div> */}
                  </div>
                  
                  <div className="form-group">
                    <label>Plan Size</label>
                    <input
                      type="text"
                      placeholder="Enter the plan size"
                      value={plan.planSize}
                      onChange={(e) => handleFloorPlanChange(index, 'planSize', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Plan Image</label>
                    <div className={`image-upload-container ${errors[`floorPlanImage-${index}`] ? 'error-border' : ''}`}>
                      {plan.planImage ? (
                        <div className="plan-image-preview">
                          <img src={plan.planImage.preview} alt={`Plan ${index}`} />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => handleFloorPlanChange(index, 'planImage', null)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <label className="upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFloorPlanImageUpload(e, index)}
                            style={{ display: 'none' }}
                          />
                          <div className="upload-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 13V19H5V13H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13H19ZM13 5L11.59 6.41L13.17 8H5V10H13.17L11.58 11.59L13 13L17 9L13 5Z" fill="#3498db"/>
                            </svg>
                          </div>
                          <div className="upload-text">
                            <p>Click to upload plan image</p>
                            <span>Minimum size 800 x 600 px</span>
                          </div>
                        </label>
                      )}
                    </div>
                    {errors[`floorPlanImage-${index}`] && (
                      <span className="error-text">{errors[`floorPlanImage-${index}`]}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter the plan description"
                      value={plan.description}
                      onChange={(e) => handleFloorPlanChange(index, 'description', e.target.value)}
                    />
                  </div>
                  
                  {formData.floorPlans.length > 1 && (
                    <button
                      type="button"
                      className="remove-floor-plan"
                      onClick={() => removeFloorPlan(index)}
                    >
                      Remove Floor Plan
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-floor-plan"
                onClick={addFloorPlan}
              >
                <FaPlus /> Add Floor Plan
              </button>
            </div>
            
            {/* Sub Listings Section */}
            <div className="form-section">
              <h3 className="section-title">Sub Listings</h3>
              
              {formData.subListings.map((sub, index) => (
                <div key={index} className="sub-listing-section">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Enter the title"
                      value={sub.title}
                      onChange={(e) => handleSubListingChange(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Bedrooms</label>
                      <input
                        type="number"
                        placeholder="Enter number of bedrooms"
                        value={sub.bedrooms}
                        onChange={(e) => handleSubListingChange(index, 'bedrooms', e.target.value)}
                        min="0"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Bathrooms</label>
                      <input
                        type="number"
                        placeholder="Enter number of bathrooms"
                        value={sub.bathrooms}
                        onChange={(e) => handleSubListingChange(index, 'bathrooms', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Property Size</label>
                      <input
                        type="text"
                        placeholder="Enter the property size"
                        value={sub.propertySize}
                        onChange={(e) => handleSubListingChange(index, 'propertySize', e.target.value)}
                      />
                    </div>
                    
                    {/* <div className="form-group">
                      <label>Size Postfix</label>
                      <input
                        type="text"
                        placeholder="Enter the property size postfix"
                        value={sub.sizePostfix}
                        onChange={(e) => handleSubListingChange(index, 'sizePostfix', e.target.value)}
                      />
                    </div> */}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="text"
                        placeholder="Enter the price (only digits)"
                        value={sub.price}
                        onChange={(e) => handleSubListingChange(index, 'price', e.target.value)}
                      />
                    </div>
                    
                    {/* <div className="form-group">
                      <label>Price Postfix</label>
                      <input
                        type="text"
                        placeholder="Enter the price postfix"
                        value={sub.pricePostfix}
                        onChange={(e) => handleSubListingChange(index, 'pricePostfix', e.target.value)}
                      />
                    </div> */}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Property Type</label>
                      <input
                        type="text"
                        placeholder="Enter the property type"
                        value={sub.propertyType}
                        onChange={(e) => handleSubListingChange(index, 'propertyType', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Availability Date</label>
                      <input
                        type="date"
                        placeholder="Enter the availability date"
                        value={sub.availabilityDate}
                        onChange={(e) => handleSubListingChange(index, 'availabilityDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {formData.subListings.length > 1 && (
                    <button
                      type="button"
                      className="remove-sub-listing"
                      onClick={() => removeSubListing(index)}
                    >
                      Remove Sub Listing
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-sub-listing"
                onClick={addSubListing}
              >
                <FaPlus /> Add Sub Listing
              </button>
            </div>
            
            {/* Additional Details Section */}
            <div className="form-section">
              <h3 className="section-title">Additional details</h3>
              
              {formData.additionalDetails.map((detail, index) => (
                <div key={index} className="additional-detail-row">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Eg: Equipment"
                      value={detail.title}
                      onChange={(e) => handleAdditionalDetailChange(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Grill - Gas"
                      value={detail.value}
                      onChange={(e) => handleAdditionalDetailChange(index, 'value', e.target.value)}
                    />
                  </div>
                  
                  {formData.additionalDetails.length > 1 && (
                    <button
                      type="button"
                      className="remove-detail"
                      onClick={() => removeAdditionalDetail(index)}
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-detail"
                onClick={addAdditionalDetail}
              >
                <FaPlus /> Add More Details
              </button>
            </div>
            
            {/* Features Section */}
            <div className="form-section">
              <h3 className="section-title">Features</h3>
              
              <div className="features-grid">
                {featureOptions.map(feature => (
                  <div key={feature} className="feature-checkbox">
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <label htmlFor={`feature-${feature}`}>{feature}</label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Private Note Section */}
            <div className="form-section">
              <h3 className="section-title">Private Note</h3>
              <div className="form-group">
                <textarea
                  name="privateNote"
                  placeholder="Write private note for this property, it will not display for public."
                  value={formData.privateNote}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>
            
            {/* Account Section (only show if no currentUser) */}
            {!currentUser && (
              <div className="form-section">
                <h3 className="section-title">Do you have an account?</h3>
                <p className="account-info-text">
                  If you don't have an account you can create one below by entering your email address. 
                  Your account details will be confirmed via email. Otherwise you can Login
                </p>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="hasAccount"
                    name="hasAccount"
                    checked={formData.hasAccount}
                    onChange={handleChange}
                  />
                  <label htmlFor="hasAccount">I already have an account</label>
                </div>
                
                {!formData.hasAccount && (
                  <div className="account-fields">
                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        className={errors.username ? 'error' : ''}
                      />
                      {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Location Section */}
            <div className="form-section">
              <h3 className="section-title">Location</h3>
              
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your property address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter the country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>State/county</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter the State/county"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter the city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Area</label>
                  <input
                    type="text"
                    name="area"
                    placeholder="Enter the area"
                    value={formData.area}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Zip/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Enter zip/postal code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>

         
      {/* Updated Map Section */}
      <div className="form-section">
        <h3 className="section-title">Map</h3>
        <div className="map-instructions">
          <p>Property location on map</p>
        </div>
        
        <div className="map-preview-container">
          <iframe
            src={mapPreview}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Property Location"
          ></iframe>
        </div>
  
   <div className="form-row">
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="text"
              name="latitude"
              placeholder="Enter latitude (e.g., 18.562061)"
              value={formData.latitude}
              onChange={handleMapCoordinatesChange}
            />
          </div>
    
     <div className="form-group">
            <label>Longitude</label>
            <input
              type="text"
              name="longitude"
              placeholder="Enter longitude (e.g., 73.914896)"
              value={formData.longitude}
              onChange={handleMapCoordinatesChange}
            />
          </div>
        </div>
        
</div>
            </div>

            
            
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPopup;