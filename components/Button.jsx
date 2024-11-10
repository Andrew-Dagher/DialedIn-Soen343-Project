import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ name, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={` px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${className}`}
    >
      {name}
    </button>
  );
};

// Define prop types for better type checking
Button.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Button;