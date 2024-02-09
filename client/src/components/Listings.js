import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { categories } from '../data';
import '../styles/listings.scss';
import Listingcard from './Listingcard';
import Loader from './Loader';
import { setlistings } from '../redux/state';

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== 'All'
          ? `http://localhost:8000/properties?category=${selectedCategory}`
          : 'http://localhost:8000/properties',

        {
          method: 'GET',
        }
      );
      const data = await response.json();
      dispatch(setlistings({ listings: data }));
      setLoading(false);
    } catch (error) {
      console.log('Fetch listings failed', error.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);
  console.log(listings);
  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
        <Listingcard />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings.map((listing) => (
            <Listingcard />
          ))}
        </div>
      )}
    </>
  );
};

export default Listings;
