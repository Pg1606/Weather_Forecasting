import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { fetchCities } from '../../api/OpenWeatherService';

import './Search.css';

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const loadOptions = async (inputValue) => {
    const citiesList = await fetchCities(inputValue);

      const newOptions = citiesList.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        };
      });

      setOptions(newOptions);
  };

  const debouncedLoadOptions = useCallback(debounce(loadOptions, 600), []);

  const onChangeHandler = (event) => {
    // setSearchValue(event);
    // onSearchChange(event);
    // loadOptions(event);

    const value = event.target.value;
    setSearchValue(value);
    if (value) {
      debouncedLoadOptions(value);
    } else {
      setOptions([]);
      setSelectedOption(null);
    }
    //onSearchChange(value);
  };

  const onSelectOption = (option) => {
    setSearchValue(option.label);
    setOptions([]);
    setSelectedOption(option.vlaue);
    onSearchChange(option);
  };

  return (
    // <AsyncPaginate
    //   placeholder="Search for cities"
    //   debounceTimeout={600}
    //   value={searchValue}
    //   onChange={onChangeHandler}
    //   loadOptions={loadOptions}
    // />
    <div className='search-container'>
      <input
        type="text"
        placeholder="Search for cities"
        value={searchValue}
        onChange={onChangeHandler}
        className='search-input'
      />
      {options.length > 0 && (
        <ul className='dropdown'>
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => onSelectOption(option)}
              className={`dropdown-item ${selectedOption === option.value ? 'selected' : ''}`}  
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
