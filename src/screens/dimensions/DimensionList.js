import DimensionItem from './DimensionItem';
import React from 'react';

const DimensionList = ({ dimensions, toggleFormModal }) => {
  return (
    <div>
      {dimensions.map(dimension => {
        return (
          <DimensionItem
            key={dimension.surveyDimensionId}
            item={dimension}
            handleClick={toggleFormModal}
          />
        );
      })}
    </div>
  );
};
export default DimensionList;
