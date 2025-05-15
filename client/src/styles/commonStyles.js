export const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1rem',
};

export const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
};

export const errorStyle = {
  color: 'red',
  marginTop: '0.25rem',
  fontSize: '0.875rem',
};

export const labelStyle = {
  marginBottom: '0.25rem',
  fontWeight: 'bold',
};

export const requiredStyle = {
  color: 'red'
};

export const textareaStyle = {
  ...inputStyle, 
  height: '100px', 
  resize: 'none'
};

export const buttonStyle = {
  padding: '0.5rem 1rem', 
  fontSize: '1rem'
};

export const serverErrorStyle = {
  color: 'red', 
  marginTop: '1rem'
};

// Page container styles
export const containerStyle = {
  maxWidth: '400px', 
  margin: '2rem auto', 
  fontFamily: 'sans-serif'
};

// Files page specific styles
export const filesContainerStyle = { 
  padding: '2rem' 
};

export const filesHeaderStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '1rem' 
};

export const titleStyle = { 
  margin: 0 
};

export const disconnectButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ff4d4f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export const filesListStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '1rem' 
};

export const fileItemStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

export const fileNameStyle = {
  fontSize: '1.25rem',
  marginBottom: '0.5rem',
  color: '#333',
};

export const fileContentStyle = {
  backgroundColor: '#eee',
  padding: '1rem',
  borderRadius: '4px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};
