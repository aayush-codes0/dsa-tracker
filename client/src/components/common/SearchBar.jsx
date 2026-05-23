import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '../../utils/helpers';

/**
 * Search input with icon and debounced onChange
 */
export default function SearchBar({
  placeholder = 'Search…',
  onSearch,
  value: controlledValue,
  className = '',
}) {
  const [localValue, setLocalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : localValue;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch?.(query);
    }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-10 pr-9"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
