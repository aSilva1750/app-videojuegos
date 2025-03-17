import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import DetalleJuegos from "./pages/DetalleJuegos";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/juego/:id" element={<DetalleJuegos />} />
            </Routes>
        </Router>
    );
}

export default App;
