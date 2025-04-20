import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import TwitterImage from "./TwitterImage";
import {
  validateConfirmPassword,
  validateDateOfBirth,
  validateEmailId,
  validateFirstName,
  validatePassword,
} from "../../validation/Validator";
import styles from "../../moduleCss/Registration.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userMSURL } from "../portsFolder/portNoForMs";
type Register = {
  firstName: string;
  lastName: string;
  emailId: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
  joinedDate: string;
};
const RegistrationForm: React.FC = () => {
  const userUrl = userMSURL;

  const [state, setState] = useState<Register>({
    firstName: "",
    lastName: "",
    emailId: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    joinedDate: new Date().toISOString().split("T")[0],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [emailIds, setEmailIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState({
    firstNameError: "",
    emailError: "",
    dateOfBirthError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  function fetchEmails() {
    axios.get(userUrl + "/userEmails").then((response) => {
      const data = response.data;
      setEmailIds(data);
    });
  }

  useEffect(() => {
    fetchEmails();
  }, []);
  function handleLoginPage() {
    navigate("/login");
  }

  const messages = {
    FIRST_NAME_ERROR: "Please Enter Valid Name",
    EMAIL_ERROR: "Please Enter Valid Email Id",
    dateOfBirth_ERROR: "You must be at least 18 years old to create an account",
    PASSWORD_ERROR:
      "Password must be 8-16 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%?&).",
    CONFIRM_PASSWORD_ERROR: "ConfirmPassword should match with password",
    MANDATORY: "All fields are mandatory. Please complete them.",
    ERROR_MESSAGE: "Something went wrong. Please try again later",
    SUCCESS_MESSAGE: "Account Created Successfully",
    EMAIL_ALREADY_EXISTS:
      "This email is already registered. Please log in or use a different email",
  };
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSuccessMessage("");
    setErrorMessage("");
    setMandatory(false);
    setState((state) => ({ ...state, [name]: value }));
    validateField(name, value);
  }
  function validateField(name: string, value: string) {
    let erros = formErrors;
    if (name === "firstName") {
      if (!validateFirstName(value)) {
        setFormErrors((errors) => ({
          ...errors,
          firstNameError: messages.FIRST_NAME_ERROR,
        }));
        erros.firstNameError = messages.FIRST_NAME_ERROR;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          firstNameError: "",
        }));
        erros.firstNameError = "";
      }
    } else if (name === "emailId") {
      if (!validateEmailId(value)) {
        setFormErrors((errors) => ({
          ...errors,
          emailError: messages.EMAIL_ERROR,
        }));
        erros.emailError = messages.EMAIL_ERROR;
      } else if (emailIds.includes(value)) {
        setFormErrors((errors) => ({
          ...errors,
          emailError: messages.EMAIL_ALREADY_EXISTS,
        }));
        erros.emailError = messages.EMAIL_ALREADY_EXISTS;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          emailError: "",
        }));
        erros.emailError = "";
      }
    } else if (name === "dateOfBirth") {
      if (!validateDateOfBirth(value)) {
        setFormErrors((errors) => ({
          ...errors,
          dateOfBirthError: messages.dateOfBirth_ERROR,
        }));
        erros.dateOfBirthError = messages.dateOfBirth_ERROR;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          dateOfBirthError: "",
        }));
        erros.dateOfBirthError = "";
      }
    } else if (name === "password") {
      if (!validatePassword(value)) {
        setFormErrors((errors) => ({
          ...errors,
          passwordError: messages.PASSWORD_ERROR,
        }));
        erros.passwordError = messages.PASSWORD_ERROR;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          passwordError: "",
        }));
        erros.passwordError = "";
      }
    } else if (name === "confirmPassword") {
      if (!validateConfirmPassword(state.password, value)) {
        setFormErrors((errors) => ({
          ...errors,
          confirmPasswordError: messages.CONFIRM_PASSWORD_ERROR,
        }));
        erros.confirmPasswordError = messages.CONFIRM_PASSWORD_ERROR;
      } else {
        setFormErrors((errors) => ({
          ...errors,
          confirmPasswordError: "",
        }));
        erros.confirmPasswordError = "";
      }
    }
    if (Object.values(erros).every((val) => val === "")) {
      setValid(true);
    } else {
      setValid(false);
    }
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(state);
    if (
      state.firstName === "" ||
      state.password === "" ||
      state.emailId === "" ||
      state.dateOfBirth === "" ||
      state.confirmPassword === ""
    ) {
      setMandatory(true);
    } else {
      setMandatory(false);
      axios
        .post(userUrl + "/signup", state)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setSuccessMessage(messages.SUCCESS_MESSAGE);
          localStorage.setItem("user", data.userId);
          localStorage.setItem(
            "credentials",
            JSON.stringify({
              emailId: data.emailId,
              password: data.password,
            })
          );
          setState((state) => ({
            ...state,
            firstName: "",
            lastName: "",
            password: "",
            dateOfBirth: "",
            confirmPassword: "",
            emailId: "",
          }));
          setErrorMessage("");
          fetchEmails();
          console.log(state);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(messages.ERROR_MESSAGE);
          setSuccessMessage("");
        });
    }
  }
  return (
    <div className="container-fluid">
      <div className="row" style={{ display: "flex", height: "100vh" }}>
        <TwitterImage />

        <div className="col-md-5 p-3" style={{ backgroundColor: "#111" }}>
          <p className={`text-white bold text-center ${styles.createAcc}`}>
            Create Your Account
          </p>
          <form
            className={`ps-4 ${styles.formContainer}`}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="firstName"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                data-testid="firstName"
                className={`form-control text-white`}
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.firstName}
                onChange={handleChange}
              />
              {formErrors.firstNameError && (
                <span className="text-danger">{formErrors.firstNameError}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="lastName"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                data-testid="firstName"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="emailId"
              >
                Email:
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
              {formErrors.emailError && (
                <span className="text-danger">{formErrors.emailError}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="dateOfBirth"
              >
                Date Of Birth:
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                data-testid="dateOfBirth"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                  colorScheme: "light",
                }}
                value={state.dateOfBirth}
                onChange={handleChange}
              />
              {formErrors.dateOfBirthError && (
                <span className="text-danger">
                  {formErrors.dateOfBirthError}
                </span>
              )}
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
              {formErrors.passwordError && (
                <span className="text-danger">{formErrors.passwordError}</span>
              )}
            </div>
            <div className="form-group">
              <label
                className={`form-label ${styles.formLabel}`}
                htmlFor="confirmPassword"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                data-testid="confirmPassword"
                className="form-control"
                style={{
                  backgroundColor: "#111",
                  color: "white",
                  height: "30px",
                }}
                value={state.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPasswordError && (
                <span className="text-danger">
                  {formErrors.confirmPasswordError}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!valid}
              className="btn btn-primary mt-2 text-center"
            >
              SIGN UP
            </button>
          </form>
          <div className={`ps-4 form-group`} style={{ width: "80%" }}>
            <p className="text-center pt-2" style={{ color: "#999" }}>
              Already Have Account?
            </p>
            <button
              className={`${styles.loginBtn}`}
              style={{ width: "100%" }}
              onClick={handleLoginPage}
            >
              SIGN IN
            </button>
            {successMessage && (
              <h5 className="text-success">
                <b>{successMessage}</b>
              </h5>
            )}
            {mandatory && (
              <h5 className="text-danger ">
                <b>{messages.MANDATORY}</b>
              </h5>
            )}
            {errorMessage && (
              <h5 className="text-danger ">
                <b>{messages.ERROR_MESSAGE}</b>
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegistrationForm;
