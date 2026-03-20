import Register from "./pages/Register";
import { useEffect } from "react";
import { loadTheme } from "./theme";
import { darkTheme } from "./themes";
import { setTheme } from "./theme";
import Dashboard from "./pages/Dashboard";

function App() {

  useEffect(() => {
    loadTheme(); // load saved theme

    // if no theme saved → set default dark
    if (!localStorage.getItem("theme")) {
      setTheme(darkTheme);
    }
  }, []);

  return <Dashboard />;
}

export default App;
