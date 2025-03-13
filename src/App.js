import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./pages/checkout-page";
import Sponsor from "./pages/sponsor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sponsor" element={<Sponsor />} />
      </Routes>
    </Router>
  );
}

export default App;
