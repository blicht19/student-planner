import { FaFilter } from 'react-icons/fa';
import { useState } from 'react';

export const Filters = () => {
  const [showFilterInputs, setShowFilterInputs] = useState(false);
  return (
    <div>
      <FaFilter />
      {showFilterInputs && <div>Filters</div>}
    </div>
  );
};
