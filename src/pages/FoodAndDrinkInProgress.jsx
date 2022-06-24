import React, { useContext, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RevenuesContext from '../context/RevenuesContext';
import HeaderRevenue from '../components/HeaderRevenue';
import ShowDetailsProcess from '../components/ShowDetailsProcess';
import Button from '../components/Button';

function FoodInProgress() {
  const {
    getDataById,
    ingredientsList,
    handleFavorite,
    handleShare,
  } = useContext(RevenuesContext);
  const location = useLocation().pathname.split('/')[1];
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      if (location === 'foods') {
        await getDataById('foods', id);
      } else {
        await getDataById('drinks', id);
      }
    };
    getData();
  }, []);

  return (
    <div>
      {ingredientsList.length > 0 && (
        <>
          <HeaderRevenue
            favorited
            handleFavorite={ handleFavorite }
            handleShare={ handleShare }
          />
          <ShowDetailsProcess />
          <Button
            name="Finish Recipe"
            dataTestId="finish-recipe-btn"
            onClick={ () => {} }
          />
        </>
      )}
    </div>
  );
}

export default FoodInProgress;
