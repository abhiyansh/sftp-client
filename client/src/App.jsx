import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FilesPage from './pages/FilesPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/files" element={<FilesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
