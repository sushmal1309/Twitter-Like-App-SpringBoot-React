import React, { ChangeEvent, FormEvent, useState } from "react";
import TwitterImage from "./TwitterImage";
import styles from "../../moduleCss/LoginForm.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { userMSURL } from "../portsFolder/portNoForMs";
type Login = {
  emailId: string;
  password: string;
};
const LoginForm: React.FC = () => {
  const userUrl = userMSURL;
  const navigate = useNavigate();
  const [state, setState] = useState<Login>({ emailId: "", password: "" });
  const [mandatory, setMandatory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const messages = {
    MANDATORY: "All fields are mandatory. Please complete them.",
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setState((state) => ({ ...state, [name]: value }));
    setMandatory(false);
    setErrorMessage("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(state);
    if (state.emailId === "" || state.password === "") {
      setMandatory(true);
      console.log("data");
    } else {
      setMandatory(false);
      axios
        .post(userUrl + "/login", state)
        .then((response) => {
          const data = response.data;
          console.log(data);
          let token = Object.keys(data)[0];
          console.log(token);

          console.log(data[token]);
          localStorage.setItem("token", token);
          localStorage.setItem("user", data[token].userId);
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              bio: data.bio,
              coverPhoto: data.coverPhoto,
              dateOfBirth: data.dateOfBirth,
              emailId: data.emailId,
              firstName: data.firstName,
              joinedDate: data.joinedDate,
              lastName: data.lastName,
              location: data.location,
              password: data.password,
              profilePicture: data.profilePicture,
              userId: data.userId,
              website: data.website,
            },
          });
          navigate("/home/profile");

          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage("Incorrect EmailId or Password");
        });
    }
  }

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "100vh", overflow: "hidden" }}>
        <TwitterImage />
        <div className="col-md-5 p-3" style={{ backgroundColor: "#111" }}>
          <p
            className="text-white bold text-center"
            style={{ fontWeight: "bold", fontSize: "30px" }}
          >
            Login Page
          </p>

          <form
            className={`ps-4 ${styles.formContainer}`}
            onSubmit={handleSubmit}
          >
            <p
              className="text-white"
              style={{ fontWeight: "bold", fontSize: "20px" }}
            >
              Welcome
            </p>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="emailId"
              >
                Email Id:
              </label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                data-testid="emailId"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.emailId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="password"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                data-testid="password"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group text-end">
              <Link to="/forgotPassword">
                <p className="text-primary">Forgot Password?</p>
              </Link>
            </div>
            <button className="btn btn-primary">LOGIN</button>

            {mandatory && (
              <h5 className="text-danger " style={{ fontSize: "16px" }}>
                <b>{messages.MANDATORY}</b>
              </h5>
            )}
            {errorMessage && (
              <p style={{ fontSize: "16px" }} className="text-danger">
                <b>{errorMessage}</b>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
