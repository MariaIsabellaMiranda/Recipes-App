import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RevenuesContext from './RevenuesContext';
import * as fetchFoods from '../services/fetchFoods';
import * as fetchDrinks from '../services/fetchDrinks';
import { getInProgressRecipes } from '../helpers/storageInProgress';
import { getFavoriteRecipes, saveFavoriteRecipes } from '../helpers/storageFavorited';
import getDoneRecipes from '../helpers/storageDoneRecipes';

const copy = require('clipboard-copy');

function RevenuesProvider({ children }) {
  const [dataRevenues, setDataRevenues] = useState([]);
  const [exibitionRevenues, setExibitionRevenues] = useState([]);
  const [exibitionDetails, setExibitionDetails] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientsSelected, setIngredientsSelected] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchOptions, setSearchOptions] = useState('');
  const [doneRecipes, setDoneRecipies] = useState('');
  const [progressRecipies, setProgressRecipies] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categorySelect, setCategorySelect] = useState({ type: '', category: '' });
  const [alertShare, setAlertShare] = useState(false);
  const [click, setClick] = useState(false);
  const [isFavorited, setIsFavorited] = useState();
  const [saveFavorite, setSaveFavorite] = useState([]);

  useEffect(() => {
    if (categorySelect.category !== '') {
      const filteringByCategory = async () => {
        if (categorySelect.type === 'drinks') {
          const data = await fetchDrinks.filterDrinks(categorySelect.category);
          return setExibitionRevenues([...data]);
        }
        const data = await fetchFoods.filterFoods(categorySelect.category);
        return setExibitionRevenues([...data]);
      };
      filteringByCategory();
    }
  }, [categorySelect]);

  const getDataByIngredients = async (fetchOption) => {
    if (fetchOption === 'foods') {
      const data = await fetchFoods.getFoodsIngredients(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }

    if (fetchOption === 'drinks') {
      const data = await fetchDrinks.getDrinksIngredients(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }
  };

  const getDataByName = async (fetchOption) => {
    if (fetchOption === 'foods') {
      const data = await fetchFoods.getFoodsName(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }

    if (fetchOption === 'drinks') {
      const data = await fetchDrinks.getDrinksName(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }
  };

  const getDataByFirstLetter = async (fetchOption) => {
    if (fetchOption === 'foods') {
      const data = await fetchFoods.getFoodsFirstLetter(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }

    if (fetchOption === 'drinks') {
      const data = await fetchDrinks.getDrinksFirstLetter(searchValue);
      setDataRevenues(data);
      setExibitionRevenues(data);
    }
  };

  const getDataById = async (fetchOption, id) => {
    if (fetchOption === 'foods') {
      const data = await fetchFoods.getFoodsId(id);
      setExibitionDetails(data);
    }

    if (fetchOption === 'drinks') {
      const data = await fetchDrinks.getDrinksId(id);
      setExibitionDetails(data);
    }
  };

  const getData = async (fetchOption) => {
    if (fetchOption === 'foods') {
      const data = await fetchFoods.getFoods();
      setDataRevenues(data);
      setExibitionRevenues(data);
    }

    if (fetchOption === 'drinks') {
      const data = await fetchDrinks.getDrinks();
      setDataRevenues(data);
      setExibitionRevenues(data);
    }
  };

  useEffect(() => {
    const TWENTY = 20;
    const FIFTEEN = 15;
    let maxIngrd = null;
    const [revenue] = exibitionDetails;
    let arrayIngredients = [];
    if (revenue) {
      if (revenue.idDrink) {
        maxIngrd = FIFTEEN;
      } else {
        maxIngrd = TWENTY;
      }

      for (let i = 1; i <= maxIngrd; i += 1) {
        if (revenue[`strIngredient${i}`] !== ''
        && revenue[`strIngredient${i}`] !== null) {
          arrayIngredients = [...arrayIngredients,
            `${revenue[`strIngredient${i}`]} - ${revenue[`strMeasure${i}`]}`];
        }
      }
    }
    setIngredientsList(arrayIngredients);
  }, [exibitionDetails]);

  const verifyRecipiesStorage = (id, option) => {
    const recipiesDone = getDoneRecipes();
    const favoriteRecipies = getFavoriteRecipes();
    const recipiesInProgress = getInProgressRecipes();

    const recipiesInProgressVerified = Object.keys(recipiesInProgress[option])
      .some((recipie) => recipie === id);
    setProgressRecipies(recipiesInProgressVerified);

    const recipiesDoneVerified = recipiesDone
      .some((recipie) => recipie.id === id);
    setDoneRecipies(recipiesDoneVerified);

    const recipiesFavoriteds = favoriteRecipies
      .some((recipie) => recipie.id === id);
    setIsFavorited(recipiesFavoriteds);
  };

  const handleFavorite = (revenue) => {
    if (!isFavorited) {
      saveFavoriteRecipes([...saveFavorite, revenue]);
      setSaveFavorite([...saveFavorite, revenue]);
    } else {
      const recipesFavoriteds = getFavoriteRecipes();
      const deleteRecipesFavoriteds = recipesFavoriteds
        .filter((recipe) => recipe.id !== revenue.id);
      saveFavoriteRecipes(deleteRecipesFavoriteds);
      setSaveFavorite(deleteRecipesFavoriteds);
    }
    setIsFavorited(!isFavorited);
  };

  const handleShare = (url) => {
    console.log(url);
    copy(url);
    setAlertShare(true);
  };

  const context = {
    dataRevenues,
    setDataRevenues,

    exibitionRevenues,
    setExibitionRevenues,

    exibitionDetails,
    setExibitionDetails,

    searchValue,
    setSearchValue,

    searchOptions,
    setSearchOptions,

    alertShare,
    setAlertShare,

    click,
    setClick,

    ingredientsList,
    doneRecipes,
    progressRecipies,
    isFavorited,
    ingredientsSelected,
    setIngredientsSelected,

    getDataByIngredients,
    getDataByName,
    getDataByFirstLetter,
    getData,

    categories,
    setCategories,

    categorySelect,
    setCategorySelect,

    getDataById,
    handleFavorite,
    handleShare,
    verifyRecipiesStorage,
  };

  return (
    <RevenuesContext.Provider value={ context }>
      {children}
    </RevenuesContext.Provider>
  );
}

RevenuesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RevenuesProvider;
