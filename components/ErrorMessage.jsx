import React from 'react';

const ErrorMessage = ({ children }) => (
  <div className="rounded-xl border-2 border-red-800 bg-red-900/20 p-4 text-red-400 text-sm sm:text-base">
    {children}
  </div>
);

export default ErrorMessage;