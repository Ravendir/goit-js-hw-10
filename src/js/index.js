import { fetchCountries } from './fetchCountries.js';
import '../css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

const createListMarkup = countries => {
  const listMarkup = countries
    .map(
      ({ name, flags }) => `<li class="country-item">
      <img src="${flags.svg}" alt="flags" width="25px" height="20px">
      <p class="text">${name.official}</p>
      </li>`,
    )
    .join('');
  return (refs.list.innerHTML = listMarkup);
};

const createInfoMarkup = countries => {
  const infoMarkup = countries
    .map(
      ({ capital, population, languages, name, flags }) =>
        `<div class="title">
          <img src="${flags.svg}" alt="flags" width="25px" height="20px">
          <h2>${name.official}</h2>
        </div>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
    <p><b>Languages:</b> ${Object.values(languages)}</p>`,
    )
    .join('');
  return (refs.info.innerHTML = infoMarkup);
};

const reset = () => {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
};

const getCountry = () => {
  const trimName = refs.input.value.trim();
  const map = fetchCountries(trimName)
    .then(item => {
      if (item.length > 10) {
        reset();
        return Notify.info('Too many matches found. Please enter a more specific name.');
      }
      if (item.length > 2 && item.length < 10) {
        reset();
        return createListMarkup(item);
      }
      if (item.length === 1) {
        reset();
        return createInfoMarkup(item);
      }
    })
    .catch(err => handleError(err));
};

const handleError = err => {
  reset();
  if (err.message === 'Country_not_found') {
    Notify.failure(`Oops, there is no country with that name`);
  }
};

refs.input.addEventListener('input', debounce(getCountry, DEBOUNCE_DELAY));
