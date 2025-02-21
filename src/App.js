import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
