import React, { memo, useMemo } from 'react';
import { useFileMonitor } from '../hooks/useFileMonitor';
import {
  filesContainerStyle,
  filesHeaderStyle,
  titleStyle,
  disconnectButtonStyle,
  filesListStyle,
  fileItemStyle,
  fileNameStyle,
  fileContentStyle
} from '../styles/commonStyles';

const FileItem = memo(({ filename, content }) => {
  const formattedContent = useMemo(() => (
    JSON.stringify(content, null, 2)
  ), [content]);

  return (
    <div style={fileItemStyle}>
      <h2 style={fileNameStyle}>{filename}</h2>
      <pre style={fileContentStyle}>{formattedContent}</pre>
    </div>
  );
});

const FilesPage = () => {
  const { files, disconnectFromSftpServer } = useFileMonitor();
  
  const fileEntries = useMemo(() => (
    Object.entries(files)
  ), [files]);

  return (
    <div style={filesContainerStyle}>
      <div style={filesHeaderStyle}>
        <h1 style={titleStyle}>Received Files</h1>
        <button onClick={disconnectFromSftpServer} style={disconnectButtonStyle}>
          Disconnect
        </button>
      </div>
      <div style={filesListStyle}>
        {fileEntries.map(([filename, content]) => (
          <FileItem key={filename} filename={filename} content={content} />
        ))}
      </div>
    </div>
  );
};

export default memo(FilesPage);
