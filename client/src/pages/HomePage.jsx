import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {INIT_CONFIG, SftpConfig} from "../../../shared/sftp-config.js";

function HomePage() {
    const navigate = useNavigate();
    const [sftpConfig, setSftpConfig] = useState(INIT_CONFIG);
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await fetch('/config', {headers: {'Cache-Control': 'no-cache'}});
                if (res.ok) setSftpConfig(await res.json());
                return;

            } catch (err) {
                console.error('Failed to fetch config', err);
            }
            console.error('Failed to fetch config');
        }

        fetchConfig().then(() => console.log("Config fetched"));
    }, []);

    const handleChange = (e) => {
        setSftpConfig({...sftpConfig, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = new SftpConfig(sftpConfig).validate();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch('/connect', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(sftpConfig),
            });

            if (res.status === 400) {
                setServerError("Failed to connect to the SFTP server. Please check the credentials and retry again.");
            } else if (res.status === 500) {
                setServerError('Internal Server Error. Please try again.');
            } else {
                navigate('/files');
            }
        } catch {
            setServerError('Network error.');
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
        <div style={{maxWidth: '400px', margin: '2rem auto', fontFamily: 'sans-serif'}}>
            <h1>Connect to SFTP</h1>
            <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Host <span style={{color: 'red'}}>*</span></label>
                    <input name="host" style={inputStyle} value={sftpConfig.host} onChange={handleChange}/>
                    {formErrors.host && <span style={errorStyle}>{formErrors.host}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>
                        Port
                    </label>
                    <input
                        type="number"
                        name="port"
                        min={1}
                        max={65535}
                        placeholder="Port (default 22)"
                        value={sftpConfig.port}
                        style={inputStyle}
                        onChange={handleChange}
                    />
                    {formErrors.port && <p style={errorStyle}>{formErrors.port}</p>}

                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Username <span style={{color: 'red'}}>*</span></label>
                    <input name="username" style={inputStyle} value={sftpConfig.username} onChange={handleChange}/>
                    {formErrors.username && <span style={errorStyle}>{formErrors.username}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Password <span style={{color: 'red'}}>*</span></label>
                    <input name="password" type="password" style={inputStyle} value={sftpConfig.password}
                           onChange={handleChange}/>
                    {formErrors.password && <span style={errorStyle}>{formErrors.password}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Remote Path</label>
                    <input name="remotePath" style={inputStyle} value={sftpConfig.remotePath} onChange={handleChange}
                           placeholder="Remote Path (default '/')"/>
                    {formErrors.remotePath && <span style={errorStyle}>{formErrors.remotePath}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Poll Interval (ms)</label>
                    <input name="pollInterval" type="number" min={1} style={inputStyle} value={sftpConfig.pollInterval}
                           onChange={handleChange} placeholder="Poll Interval (default 1000)"/>
                    {formErrors.pollInterval && <span style={errorStyle}>{formErrors.pollInterval}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Indication Map</label>
                    <textarea
                        name="indicationMap"
                        placeholder='{"A": "Running"}'
                        style={{...inputStyle, height: '100px', resize: 'none'}}
                        value={sftpConfig.indicationMap}
                        onChange={handleChange}
                    />
                    {formErrors.indicationMap && <span style={errorStyle}>{formErrors.indicationMap}</span>}
                </div>

                <button type="submit" style={{padding: '0.5rem 1rem', fontSize: '1rem'}}>
                    Connect
                </button>

                {serverError && <p style={{color: 'red', marginTop: '1rem'}}>{serverError}</p>}
            </form>
        </div>
    );
}

export default HomePage;
