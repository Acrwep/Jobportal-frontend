import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
