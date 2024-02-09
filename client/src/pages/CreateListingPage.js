import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { IoIosImages } from 'react-icons/io';
import { BiTrash } from 'react-icons/bi';

import '../styles/createlisting.scss';
import variable from '../styles/Variables.scss';
import Navbar from '../components/Navbar';
import { categories, facilities, types } from '../data';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListingPage = () => {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const navigate = useNavigate();

  /* FORM FOR LOCATION ADDRESS*/
  const [formLocation, setFormLocation] = useState({
    streetAddress: '',
    aptSuite: '',
    city: '',
    country: '',
    province: '',
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  /* AMENITIES */
  const [amenities, setAmenities] = useState([]);

  const handleSelectedFacilities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevFacility) =>
        prevFacility.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  /* BASIC COUNTS */
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  //Drag, Drop, Upload, Remove Photos
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [recordedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, recordedItem);

    setPhotos(items);
  };

  /* FORM DESCRIPTION */

  const [formDescription, setFormDescription] = useState({
    title: '',
    description: '',
    highlight: '',
    highlightDesc: '',
    price: '',
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const handleRemove = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const creatorId = useSelector((state) => state.user._id);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      //CREATE FORM DATA TO HANDLE FILE UPLOAD
      const listingForm = new FormData();

      console.log(listingForm);

      listingForm.append('creator', creatorId);
      listingForm.append('category', category);
      listingForm.append('type', type);
      listingForm.append('streetAddress', formLocation.streetAddress);
      listingForm.append('aptSuite', formLocation.aptSuite);
      listingForm.append('city', formLocation.city);
      listingForm.append('province', formLocation.province);
      listingForm.append('country', formLocation.country);
      listingForm.append('guestCount', guestCount);
      listingForm.append('bedroomCount', bedroomCount);
      listingForm.append('bedCount', bedCount);
      listingForm.append('bathroomCount', bathroomCount);
      listingForm.append('amenities', amenities);
      listingForm.append('title', formDescription.title);
      listingForm.append('description', formDescription.description);
      listingForm.append('highlight', formDescription.highlight);
      listingForm.append('highlightDesc', formDescription.highlightDesc);
      listingForm.append('price', formDescription.price);

      //Append each selected photo to the formdata object
      photos.forEach((photo) => {
        listingForm.append('listingPhotos', photo);
      });

      const response = await fetch('http://localhost:8000/properties/create', {
        method: 'POST',
        body: listingForm,
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.log('Publish listing failed', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-listing">
        <h1>Publish Your Place</h1>
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            <h3>Which of these categories best describe your place?</h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? 'selected' : ''
                  }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <h3>What types of place will guests have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  key={index}
                  className={`type ${type === item.name ? 'selected' : ''}`}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>
            <h3>Where's your place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicablle)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
            <h3>Share some basic about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      guestCount > 1 && setGuestCount(guestCount - 1)
                    }
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => setGuestCount(guestCount + 1)}
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      bedroomCount > 1 && setBedroomCount(bedroomCount - 1)
                    }
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => setBedroomCount(bedroomCount + 1)}
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => bedCount > 1 && setBedCount(bedCount - 1)}
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => setBedCount(bedCount + 1)}
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      bathroomCount > 1 && setBathroomCount(bathroomCount - 1)
                    }
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => setBathroomCount(bathroomCount + 1)}
                    sx={{
                      fontSize: '25px',
                      cursor: 'pointer',
                      '&:hover': { color: variable.pinkred },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />
            <h3>Tell guests what your place has to offer </h3>
            <div className="amenities">
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? 'selected' : ''
                  }`}
                  key={index}
                  onClick={() => handleSelectedFacilities(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
            <h3>Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="owner-multiple-image"
                          type="file"
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="owner-multiple-image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="photo"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemove(index)}
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        <input
                          id="owner-multiple-image"
                          type="file"
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="owner-multiple-image"
                          className="together"
                        >
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <h3>What makes your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight Details</p>
              <textarea
                type="text"
                placeholder="Highlight Details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
              />
              <p>Now, Set your PRICE</p>
              <span>$</span>
              <input
                type="number"
                placeholder="0"
                name="price"
                className="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                required
              />
            </div>
          </div>
          <button className="submit_btn" type="submit">
            CREATE YOUR LISTING
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateListingPage;
