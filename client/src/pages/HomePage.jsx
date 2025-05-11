import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        host: '',
        port: '',
        username: '',
        password: '',
        remotePath: '',
        pollInterval: '',
        indicationMap: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError('');

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
                        remotePath: form.remotePath
                    },
                    pollInterval: +form.pollInterval,
                    indicationMap: JSON.parse(form.indicationMap),
                }),
            });

            if (res.status === 400) {
                const data = await res.json();
                setErrors(data.errors || {});
            } else if (res.status === 500) {
                setServerError('Internal Server Error. Please try again.');
            } else if (res.ok) {
                navigate('/files');
            }
        } catch (err) {
            setServerError('Network error or invalid JSON in indication mapping.');
        }
    };

    return (
        <div>
            <h1>Connect to SFTP</h1>
            <form onSubmit={handleSubmit}>
                <input name="host" placeholder="Host" value={form.host} onChange={handleChange} />
                {errors.host && <p>{errors.host}</p>}

                <input name="port" placeholder="Port" value={form.port} onChange={handleChange} />
                {errors.port && <p>{errors.port}</p>}

                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                {errors.username && <p>{errors.username}</p>}

                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                {errors.password && <p>{errors.password}</p>}

                <input name="remotePath" placeholder="Remote Path" value={form.remotePath} onChange={handleChange} />
                {errors.remotePath && <p>{errors.remotePath}</p>}

                <input
                    name="pollInterval"
                    placeholder="Poll Interval (ms)"
                    value={form.pollInterval}
                    onChange={handleChange}
                />
                {errors.pollInterval && <p>{errors.pollInterval}</p>}

                <textarea
                    name="indicationMap"
                    placeholder='Indication Map (e.g. {"A": "Running"})'
                    value={form.indicationMap}
                    onChange={handleChange}
                />
                {errors.indicationMap && <p>{errors.indicationMap}</p>}

                <button type="submit">Connect</button>

                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
            </form>
        </div>
    );
}

export default HomePage;
