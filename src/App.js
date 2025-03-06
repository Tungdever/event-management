import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./pages/checkout-page";
import Detail from "./pages/desktop12"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;
