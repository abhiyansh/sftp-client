import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SFTP_POLLING_JOB_NOT_RUNNING } from "../../../shared/constants.js";

/**
 * Custom hook for monitoring files via Server-Sent Events (SSE) and managing SFTP connection
 */
export function useFileMonitor() {
  const [processedFiles, setProcessedFiles] = useState({});
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  const handleFileUpdate = useCallback((event) => {
    try {
      const fileData = JSON.parse(event.data);
      setProcessedFiles(previousFiles => ({...previousFiles, ...fileData}));
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
    }
  }, []);

  const setupEventSourceConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource('/events');
    eventSourceRef.current = eventSource;
    
    eventSource.onmessage = handleFileUpdate;
    
    eventSource.addEventListener(SFTP_POLLING_JOB_NOT_RUNNING, () => {
      console.log('SFTP polling job not running, redirecting to home');
      eventSource.close();
      navigate('/');
    });
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };
    
    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [navigate, handleFileUpdate]);

  useEffect(() => {
    return setupEventSourceConnection();
  }, [setupEventSourceConnection]);

  const disconnectFromSftpServer = useCallback(async () => {
    try {
      const response = await fetch('/disconnect', {method: 'POST'});
      
      if (response.ok) {
        navigate('/');
        return true;
      } else {
        const errorData = await response.text();
        console.error('Failed to disconnect from SFTP server:', errorData);
        return false;
      }
    } catch (error) {
      console.error('SFTP disconnect request failed:', error);
      return false;
    }
  }, [navigate]);

  return useMemo(() => ({
    files: processedFiles,
    disconnectFromSftpServer
  }), [processedFiles, disconnectFromSftpServer]);
}
