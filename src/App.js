import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainSideMenu from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

function App() {
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <MainSideMenu />
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
