import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import { AppProvider } from './context/appContext.jsx';

import First from "./components/First";
import Dashboard from "./components/Dashboard";

import "./styles/first.scss";
import "./styles/dash.scss";
import "./styles/modal.scss";

function App() {

    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<First />}/>
                    <Route path="/dash/*" element={<Dashboard />}/>
                </Routes>

                <Toaster position="top-center" />
            </Router>
        </AppProvider>
    );
}

export default App;
