import { Provider } from "react-redux";
import { store } from "./store";
import { PatientsPage } from "./components/organisms/PatientsPage";

function App() {
  return (
    <Provider store={store}>
      <PatientsPage />
    </Provider>
  );
}

export default App;
