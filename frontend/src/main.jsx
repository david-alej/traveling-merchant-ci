import App from "./app/App.jsx"
import store from "./app/store.js"

import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store()}>
      <App />
    </Provider>
  </React.StrictMode>
)
