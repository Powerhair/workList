import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Result from "./Result";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
