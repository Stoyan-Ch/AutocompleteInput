import { useEffect, useState } from 'react';
import { SearchProps } from './types';

export const SearchResult = ({ results }: { results: SearchProps[] }) => {
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    setRenderTime(timeTaken);
  }, []);

  return (
    <div className='result'>
      <ul>
        <div className='gray-text'>
          {results.length} result{results.length > 1 ? 's' : ''} (
          {renderTime.toFixed(2)} ms)
        </div>
        {results.map((result, index) => {
          return (
            <li key={result.title + index}>
              <h3 className='title'>{result.title}</h3>
              <div>{result.description}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
