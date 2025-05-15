import React from 'react';
import {useFileMonitor} from '../hooks/useFileMonitor';

function FilesPage() {
    const {files, disconnectFromSftpServer} = useFileMonitor();

    return (
        <div style={{padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h1 style={{margin: 0}}>Received Files</h1>
                <button
                    onClick={disconnectFromSftpServer}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Disconnect
                </button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {Object.entries(files).map(([filename, content]) => (
                    <div
                        key={filename}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '1rem',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '1.25rem',
                                marginBottom: '0.5rem',
                                color: '#333',
                            }}
                        >
                            {filename}
                        </h2>
                        <pre
                            style={{
                                backgroundColor: '#eee',
                                padding: '1rem',
                                borderRadius: '4px',
                                overflowX: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}
                        >
              {JSON.stringify(content, null, 2)}
            </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilesPage;
