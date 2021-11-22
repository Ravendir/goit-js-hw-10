const apiCountry = 'https://restcountries.com/v3.1/name';

const fetchCountries = name => {
  return fetch(`${apiCountry}/${name}`).then(response => {
    if (!response.ok) {
      return Promise.reject(new Error('Country_not_found'));
    }
    return response.json();
  });
};

export { fetchCountries };
