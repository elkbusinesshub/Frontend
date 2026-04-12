// import ReactDOM from 'react-dom/client'; // Important for React 18+
// import './index.css';
// import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './store';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </Provider>
// );
import ReactDOM from "react-dom/client";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom"; // ✅ ADD THIS

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter> {/* ✅ REQUIRED */}
        <>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
          />
        </>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
