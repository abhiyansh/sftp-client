import React from 'react';
import { useSftpConfig } from '../hooks/useSftpConfig';

function HomePage() {
    const {
        sftpConfig,
        formErrors,
        serverError,
        handleFormFieldChange,
        handleFormSubmit
    } = useSftpConfig();

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
            <form onSubmit={handleFormSubmit}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Host <span style={{color: 'red'}}>*</span></label>
                    <input name="host" style={inputStyle} value={sftpConfig.host} onChange={handleFormFieldChange}/>
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
                        onChange={handleFormFieldChange}
                    />
                    {formErrors.port && <p style={errorStyle}>{formErrors.port}</p>}

                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Username <span style={{color: 'red'}}>*</span></label>
                    <input name="username" style={inputStyle} value={sftpConfig.username} onChange={handleFormFieldChange}/>
                    {formErrors.username && <span style={errorStyle}>{formErrors.username}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Password <span style={{color: 'red'}}>*</span></label>
                    <input name="password" type="password" style={inputStyle} value={sftpConfig.password}
                           onChange={handleFormFieldChange}/>
                    {formErrors.password && <span style={errorStyle}>{formErrors.password}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Remote Path</label>
                    <input name="remotePath" style={inputStyle} value={sftpConfig.remotePath} onChange={handleFormFieldChange}
                           placeholder="Remote Path (default '/')"/>
                    {formErrors.remotePath && <span style={errorStyle}>{formErrors.remotePath}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Poll Interval (ms)</label>
                    <input name="pollInterval" type="number" min={1} style={inputStyle} value={sftpConfig.pollInterval}
                           onChange={handleFormFieldChange} placeholder="Poll Interval (default 1000)"/>
                    {formErrors.pollInterval && <span style={errorStyle}>{formErrors.pollInterval}</span>}
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Indication Map</label>
                    <textarea
                        name="indicationMap"
                        placeholder='{"A": "Running"}'
                        style={{...inputStyle, height: '100px', resize: 'none'}}
                        value={sftpConfig.indicationMap}
                        onChange={handleFormFieldChange}
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
