import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {INIT_CONFIG, SftpConfig} from "../../../shared/sftp-config.js";

/**
 * Custom hook for managing SFTP configuration
 * Handles state management, validation, API calls, and navigation
 */
export function useSftpConfig() {
  const navigate = useNavigate();
  const [sftpConfig, setSftpConfig] = useState(INIT_CONFIG);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  const fetchSftpConfigFromServer = useCallback(async () => {
    try {
      const response = await fetch('/config', { headers: { 'Cache-Control': 'no-cache' } });
      if (response.ok) {
        const configData = await response.json();
        setSftpConfig(configData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fetch SFTP configuration:', error);
      return false;
    }
  }, []);

  const connectToSftpServer = useCallback(async (configData) => {
    try {
      const response = await fetch('/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });

      return { 
        success: response.ok, 
        status: response.status 
      };
    } catch (error) {
      console.error('Connection request failed:', error);
      return { 
        success: false, 
        error: 'network_error' 
      };
    }
  }, []);

  useEffect(() => {
    fetchSftpConfigFromServer()
      .then((success) => {
        if (success) {
          console.log("SFTP configuration loaded from server");
        } else {
          console.error("Failed to load SFTP configuration");
        }
      });
  }, [fetchSftpConfigFromServer]);

  const handleFormFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    setSftpConfig(prevConfig => ({
      ...prevConfig, 
      [name]: value
    }));
  }, []);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    setServerError('');
    setFormErrors({});
    
    const validationErrors = new SftpConfig(sftpConfig).validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const connectionResult = await connectToSftpServer(sftpConfig);
    
    if (!connectionResult.success) {
      if (connectionResult.error === 'network_error') {
        setServerError('Network error. Please check your connection and try again.');
      } else if (connectionResult.status === 400) {
        setServerError("Failed to connect to the SFTP server. Please check the credentials and try again.");
      } else if (connectionResult.status === 500) {
        setServerError('Internal Server Error. Please try again later.');
      } else {
        setServerError('An unknown error occurred. Please try again.');
      }
      return;
    }
    
    navigate('/files');
  }, [sftpConfig, connectToSftpServer, navigate]);

  return useMemo(() => ({
    sftpConfig,
    formErrors,
    serverError,
    handleFormFieldChange,
    handleFormSubmit
  }), [sftpConfig, formErrors, serverError, handleFormFieldChange, handleFormSubmit]);
}
