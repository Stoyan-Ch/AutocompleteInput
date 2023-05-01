import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { SearchProps } from './types';
import { useFocus } from '../../hooks/useFocus';
import { SearchResult } from './SearchResult';
import './AutocompleteInput.css';

export const AutocompleteInput = ({ options }: { options: SearchProps[] }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<SearchProps[]>([]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(-1);
  const [recentlySearched, setRecentlySearched] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchProps[]>([]);

  const autocompleteRef = useRef(null);
  const { isFocused, setIsFocused } = useFocus(autocompleteRef);

  useEffect(() => {
    localStorage.setItem('recentlySearched', JSON.stringify([]));

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentlySearched', JSON.stringify(recentlySearched));
  }, [recentlySearched]);

  const handleInput = (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    filterSuggestions(value, options);
  };

  const filterSuggestions = (query: string, options: SearchProps[]) => {
    const queryToLowerCase = query.toLowerCase();

    const allResults = options.filter(suggestion =>
      suggestion.title.toLowerCase().includes(queryToLowerCase)
    );

    const topTenResults = allResults.slice(0, 10);
    setSuggestions(topTenResults);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!suggestions.length || !inputRef.current) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (selectedOptionIdx === suggestions.length - 1) return;

        setSelectedOptionIdx(prev => prev + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedOptionIdx > 0) {
          setSelectedOptionIdx(prev => prev - 1);
        }
        break;
      case 'Enter':
        //in case options is not selected, search for the input's value
        if (selectedOptionIdx === -1) {
          addToRecentlySearched(inputRef.current.value);
          handleSearchResults(inputRef.current.value);
          setSuggestions([]);
          return;
        }

        inputRef.current.value = suggestions[selectedOptionIdx].title;
        addToRecentlySearched(suggestions[selectedOptionIdx].title);
        handleSearchResults(suggestions[selectedOptionIdx].title);
        setSuggestions([]);

        break;
      default:
        setSelectedOptionIdx(-1);
        return;
    }
  };

  const handleSearchResults = (query: string) => {
    const queryToLowerCase = query.toLowerCase();
    const result = options.filter(
      option =>
        option.title.toLowerCase().includes(queryToLowerCase) ||
        option.description.toLowerCase().includes(queryToLowerCase)
    );

    setSearchResults(result);
  };

  const handleSuggestionClick = (event: React.MouseEvent<EventTarget>) => {
    const clickedElement = event.target as HTMLElement;
    const text = clickedElement.innerText;
    console.log('e', event);
    if (text === 'Remove') {
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = text;
      addToRecentlySearched(text);
      handleSearchResults(text);
      setSuggestions([]);
    }
  };

  const handleRemoveClick = (value: string) => {
    const filteredSearches = recentlySearched.filter(
      search => search !== value
    );

    setRecentlySearched(filteredSearches);
  };

  const addToRecentlySearched = (searchValue: string) => {
    if (recentlySearched.indexOf(searchValue) === -1) {
      const recentlySearchedUpdated = recentlySearched.length
        ? [...recentlySearched, searchValue]
        : [searchValue];

      setRecentlySearched(recentlySearchedUpdated);
    }
  };

  const isSearchedRecently = (value: string): boolean => {
    return recentlySearched.includes(value);
  };

  return (
    <div className='container'>
      <div className='autocomplete' ref={autocompleteRef}>
        <input
          ref={inputRef}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={e => handleKeyDown(e)}
          onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
          <ul>
            {suggestions.map((option, index) => (
              <div key={option.title + index} className='flex'>
                <li
                  onClick={e => handleSuggestionClick(e)}
                  className={`${index === selectedOptionIdx ? 'selected' : ''} 
            ${isSearchedRecently(option.title) ? 'searched' : ''}`}
                >
                  <div className='title'>{option.title}</div>
                  {isSearchedRecently(option.title) && (
                    <div
                      className='remove'
                      onClick={() => handleRemoveClick(option.title)}
                    >
                      Remove
                    </div>
                  )}
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
      {searchResults.length ? <SearchResult results={searchResults} /> : null}
    </div>
  );
};
