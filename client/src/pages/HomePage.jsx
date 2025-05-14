import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        host: '',
        port: '22',
        username: '',
        password: '',
        remotePath: '/',
        pollInterval: '1000',
        indicationMap: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await fetch('/config', {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Object.keys(data).length > 0) {
                        setForm({
                            host: data.sftpConfig.host,
                            port: data.sftpConfig.port.toString(),
                            username: data.sftpConfig.username,
                            password: data.sftpConfig.password,
                            remotePath: data.sftpConfig.remotePath,
                            pollInterval: data.pollInterval.toString(),
                            indicationMap: JSON.stringify(data.indicationMap),
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to fetch config', err);
            }
        }

        fetchConfig();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.host.trim()) newErrors.host = 'Host is required';
        if (form.port.trim()) {
            const portNum = Number(form.port);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                newErrors.port = 'Port must be a number between 1 and 65535';
            }
        }
        if (!form.username.trim()) newErrors.username = 'Username is required';
        if (!form.password.trim()) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch('/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sftpConfig: {
                        host: form.host,
                        port: +form.port,
                        username: form.username,
                        password: form.password,
                        remotePath: form.remotePath,
                    },
                    pollInterval: +form.pollInterval,
                    indicationMap: form.indicationMap ? JSON.parse(form.indicationMap) : form.indicationMap,
                }),
            });

            if (res.status === 400) {
                setServerError("Failed to connect to the SFTP server. Please check the credentials and retry again.");
            } else if (res.status === 500) {
                setServerError('Internal Server Error. Please try again.');
            } else if (res.ok) {
                navigate('/files');
            }
        } catch (err) {
            setServerError('Network error or invalid JSON in indication mapping.');
        }
    };

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

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h1>Connect to SFTP</h1>
            <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Host <span style={{color: 'red'}}>*</span></label>
                    <input name="host" style={inputStyle} value={form.host} onChange={handleChange} />
                    {errors.host && <span style={errorStyle}>{errors.host}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>
                        Port
                    </label>
                    <input
                        type="number"
                        name="port"
                        min="1"
                        max="65535"
                        placeholder="Port (default 22)"
                        value={form.port}
                        style={inputStyle}
                        onChange={handleChange}
                    />
                    {errors.port && <p style={errorStyle}>{errors.port}</p>}

                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Username <span style={{color: 'red'}}>*</span></label>
                    <input name="username" style={inputStyle} value={form.username} onChange={handleChange} />
                    {errors.username && <span style={errorStyle}>{errors.username}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Password <span style={{color: 'red'}}>*</span></label>
                    <input name="password" type="password" style={inputStyle} value={form.password} onChange={handleChange} />
                    {errors.password && <span style={errorStyle}>{errors.password}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Remote Path</label>
                    <input name="remotePath" style={inputStyle} value={form.remotePath} onChange={handleChange} placeholder="Remote Path (default '/')"/>
                    {errors.remotePath && <span style={errorStyle}>{errors.remotePath}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Poll Interval (ms)</label>
                    <input name="pollInterval" style={inputStyle} value={form.pollInterval} onChange={handleChange} placeholder="Poll Interval (default 1000)"/>
                    {errors.pollInterval && <span style={errorStyle}>{errors.pollInterval}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Indication Map</label>
                    <textarea
                        name="indicationMap"
                        placeholder='{"A": "Running"}'
                        style={{ ...inputStyle, height: '100px' }}
                        value={form.indicationMap}
                        onChange={handleChange}
                    />
                    {errors.indicationMap && <span style={errorStyle}>{errors.indicationMap}</span>}
                </div>

                <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                    Connect
                </button>

                {serverError && <p style={{ color: 'red', marginTop: '1rem' }}>{serverError}</p>}
            </form>
        </div>
    );
}

export default HomePage;
