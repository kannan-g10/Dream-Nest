const router = require('express').Router();
const multer = require('multer');

const Listing = require('../models/Listing');
const User = require('../models/User');

/* CONFIGURATION MULTER FOR FILE UPLOAD */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); //store uploaded file in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //store in files original name
  },
});

const upload = multer({ storage });

router.post('/create', upload.array('listingPhotos'), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;

    if (!listingPhotos) {
      return res.status(400).json('No file Uploaded');
    }

    const listingPhotosPaths = listingPhotos.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotosPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();
    res.status(200).json(newListing);
  } catch (error) {
    res.status(409).json({
      message: 'Failed to create listings',
      error: error.message,
    });

    console.log(error);
  }
});

router.get('/', async (req, res) => {
  const qCategory = req.query.category;
  try {
    let listings;
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate(
        'creator'
      );
    } else {
      listings = await Listing.find().populate('creator');
    }

    res.status(200).json(listings);
  } catch (error) {
    res.status(409).json({
      message: 'Failed to fetch listings',
      error: error.message,
    });

    console.log(error);
  }
});

module.exports = router;
