import React, { lazy, Suspense } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Authentication from "./components/Authentication/Authentication";
// import RegistrationForm from "./components/Authentication/RegistrationForm";
// import LoginForm from "./components/Authentication/LoginForm";
// import ResetPassword from "./components/Authentication/ForgotPassword";
// import Home from "./HomeSection/Home";

const LazyAuthentication = lazy(
  () => import("./components/Authentication/Authentication")
);
const LazyRegistrationForm = lazy(
  () => import("./components/Authentication/RegistrationForm")
);
const LazyLoginForm = lazy(
  () => import("./components/Authentication/LoginForm")
);
const LazyResetPassword = lazy(
  () => import("./components/Authentication/ForgotPassword")
);
const LazyHome = lazy(() => import("./HomeSection/Home"));

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyAuthentication />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyRegistrationForm />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyLoginForm />
              </Suspense>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/home/*"
            element={
              <Suspense
                fallback={
                  <h3 className="text-center text-primary">Loading...</h3>
                }
              >
                <LazyHome />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
