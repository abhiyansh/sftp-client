import React, { memo } from 'react';
import { useSftpConfig } from '../hooks/useSftpConfig';
import { InputField, TextareaField } from '../components/FormComponents';
import { 
  containerStyle, 
  buttonStyle, 
  serverErrorStyle 
} from '../styles/commonStyles';

const HomePage = () => {
  const {
    sftpConfig,
    formErrors,
    serverError,
    handleFormFieldChange,
    handleFormSubmit
  } = useSftpConfig();

  return (
    <div style={containerStyle}>
      <h1>Connect to SFTP</h1>
      <form onSubmit={handleFormSubmit}>
        <InputField
          label="Host"
          name="host"
          value={sftpConfig.host}
          onChange={handleFormFieldChange}
          error={formErrors.host}
          required
        />

        <InputField
          label="Port"
          name="port"
          type="number"
          value={sftpConfig.port}
          onChange={handleFormFieldChange}
          error={formErrors.port}
          min={1}
          max={65535}
          placeholder="Port (default 22)"
        />

        <InputField
          label="Username"
          name="username"
          value={sftpConfig.username}
          onChange={handleFormFieldChange}
          error={formErrors.username}
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={sftpConfig.password}
          onChange={handleFormFieldChange}
          error={formErrors.password}
          required
        />

        <InputField
          label="Remote Path"
          name="remotePath"
          value={sftpConfig.remotePath}
          onChange={handleFormFieldChange}
          error={formErrors.remotePath}
          placeholder="Remote Path (default '/')"
        />

        <InputField
          label="Poll Interval (ms)"
          name="pollInterval"
          type="number"
          min={1}
          value={sftpConfig.pollInterval}
          onChange={handleFormFieldChange}
          error={formErrors.pollInterval}
          placeholder="Poll Interval (default 1000)"
        />

        <TextareaField
          label="Indication Map"
          name="indicationMap"
          value={sftpConfig.indicationMap}
          onChange={handleFormFieldChange}
          error={formErrors.indicationMap}
          placeholder='{"A": "Running"}'
        />

        <button type="submit" style={buttonStyle}>
          Connect
        </button>

        {serverError && <p style={serverErrorStyle}>{serverError}</p>}
      </form>
    </div>
  );
};

export default memo(HomePage);
