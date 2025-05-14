import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {SFTP_CONFIG_MISSING} from "../../../shared/constants.js";

function FilesPage() {
    const [files, setFiles] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setFiles((prev) => ({...prev, ...data}));
            } catch (err) {
                console.error('Invalid SSE data', err);
            }
        };

        eventSource.addEventListener(SFTP_CONFIG_MISSING, () => {
            eventSource.close();
            navigate('/');
        });

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [navigate]);

    const handleDisconnect = async () => {
        try {
            const response = await fetch('/disconnect', {method: 'POST'});
            if (response.ok) {
                navigate('/');
            } else {
                console.error('Failed to disconnect');
            }
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    };

    return (
        <div style={{padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h1 style={{margin: 0}}>Received Files</h1>
                <button
                    onClick={handleDisconnect}
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
