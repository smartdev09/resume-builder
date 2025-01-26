import React from 'react';

const EducationIcon = ({ 
  width = 48, 
  height = 48, 
  color = '#886FFF',
  className = 'flex justify-center',
  ...props 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M24 14L33.565 18.391L24 22.782L14.435 18.391L24 14Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.435 18.391L24 22.782L33.565 18.391"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 22.782V31"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 17.366V25.643C18 27.537 20.686 29.049 24 29.049C27.314 29.049 30 27.537 30 25.643V17.366"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EducationIcon;