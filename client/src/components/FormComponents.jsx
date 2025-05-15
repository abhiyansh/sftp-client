import React, { memo } from 'react';

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
};

const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
};

const errorStyle = {
  color: 'red',
  marginTop: '0.25rem',
  fontSize: '0.875rem',
};

const labelStyle = {
  marginBottom: '0.25rem',
  fontWeight: 'bold',
};

const requiredStyle = {
  color: 'red'
};

const textareaStyle = {
  ...inputStyle, 
  height: '100px', 
  resize: 'none'
};

export const InputField = memo(({
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false, 
  type = 'text',
  placeholder = '',
  min,
  max
}) => (
  <div style={fieldStyle}>
    <label style={labelStyle}>
      {label} {required && <span style={requiredStyle}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      style={inputStyle}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
    />
    {error && <span style={errorStyle}>{error}</span>}
  </div>
));

export const TextareaField = memo(({
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  placeholder = ''
}) => (
  <div style={fieldStyle}>
    <label style={labelStyle}>
      {label} {required && <span style={requiredStyle}>*</span>}
    </label>
    <textarea
      name={name}
      style={textareaStyle}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <span style={errorStyle}>{error}</span>}
  </div>
));
