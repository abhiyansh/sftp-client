import React, { memo } from 'react';
import {
  fieldStyle,
  inputStyle,
  errorStyle,
  labelStyle,
  requiredStyle,
  textareaStyle
} from '../styles/commonStyles';

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
