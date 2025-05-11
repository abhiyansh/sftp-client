import { useEffect, useState } from 'react';

function FilesPage() {
    const [files, setFiles] = useState({});

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setFiles((prev) => ({ ...prev, ...data }));
            } catch (err) {
                console.error('Invalid SSE data', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Received Files</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
