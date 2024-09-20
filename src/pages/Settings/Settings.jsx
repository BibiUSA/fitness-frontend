import { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [deleteBox, setDeleteBox] = useState("hidden");
  const [deleteItem, setDeleteItem] = useState("");
  const [deleteWarning, setDeleteWarning] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountSetting, setAccountSetting] = useState("hidden");
  const [dataSetting, setDataSetting] = useState("hidden");
  const [profileSetting, setProfileSetting] = useState("hidden");

  const tokenLogging = async () => {
    console.log("tokenLoggin");
    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      if (token != null) {
        const response = await axios.post(
          "http://localhost:3001/account/protect",
          {},
          {
            headers: headers,
          }
        );
        setEmail(response.data.email);
      } else {
        window.location = "/account";
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tokenLogging();
  }, []);

  console.log(email);

  const removeAllPlans = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/account/${email}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAccount = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/account/remove/${email}`
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const removal = () => {
    if (deleteItem === "account") {
      removeAllPlans();
      removeAccount();
      setDeleteBox("hidden");
    } else {
      removeAllPlans();
      setDeleteBox("hidden");
    }
  };

  const deletePlans = () => {
    setDeleteBox("warning");
    setDeleteItem("plan");
    setDeleteWarning(
      "Are you sure you want to delete all your plans? This will also delete all scheduled plans."
    );
  };
  const deleteAccount = () => {
    setDeleteBox("warning");
    setDeleteItem("account");
    setDeleteWarning(
      "Are you sure you want to delete your whole account? This will also delete all your plans, data, and profile"
    );
  };

  const logOut = () => {
    localStorage.removeItem("auth_token");
    window.location = "/account";
  };

  const saveName = async () => {
    try {
      const response = axios.post("http://localhost:3001/account/addName", {
        firstName: firstName,
        lastName: lastName,
        email: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggle = (x, setX) => {
    if (x === "hidden") {
      setX("");
    } else {
      setX("hidden");
    }
  };

  return (
    <div className="Settings">
      <div className="heading">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l14 0" />
            <path d="M5 12l6 6" />
            <path d="M5 12l6 -6" />
          </svg>
        </Link>
        <h3 className="title">General</h3>
      </div>
      <div
        className="moreSettings"
        onClick={() => {
          toggle(profileSetting, setProfileSetting);
        }}
      >
        <p>Profile</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </div>
      <div className={`${profileSetting} "names"`}>
        <form onSubmit={saveName}>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            name="first-name"
            id="first-name"
            className="name"
            required
            value={firstName}
            onChange={() => {
              setFirstName(event.target.value);
            }}
          ></input>
          <br></br>
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            name="last-name"
            id="last-name"
            className="name"
            required
            value={lastName}
            onChange={() => {
              setLastName(event.target.value);
              console.log(lastName);
            }}
          ></input>
          <br></br>
          <input type="submit" value="Save" className="save"></input>
        </form>
      </div>
      <div
        className="moreSettings"
        onClick={() => {
          toggle(accountSetting, setAccountSetting);
        }}
      >
        <p>Your Account</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </div>
      <input
        type="button"
        value="delete your account"
        className={accountSetting}
        onClick={deleteAccount}
      />
      <div
        className="moreSettings"
        onClick={() => {
          toggle(dataSetting, setDataSetting);
        }}
      >
        <p>Your Plans</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </div>
      <input
        type="button"
        value="delete all plans"
        onClick={deletePlans}
        className={dataSetting}
      />
      <div className="moreSettings">
        <p>About Us</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M15 16l4 -4" />
          <path d="M15 8l4 4" />
        </svg>
      </div>
      <p>
        Created to help you build great habits and accomplish your goals.{" "}
        <br></br>
        Created by Bibi Mathew. Connect with me on Linkedin and GitHub below.
      </p>
      <a
        href="https://www.linkedin.com/in/thebibimathew/"
        target="_blank"
        className="socials"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M8 11l0 5" />
          <path d="M8 8l0 .01" />
          <path d="M12 16l0 -5" />
          <path d="M16 16v-3a2 2 0 0 0 -4 0" />
        </svg>
      </a>
      <a href="https://github.com/BibiUSA" target="_blank" className="socials">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </svg>
      </a>
      <input
        type="button"
        value="Log Out"
        className="logOut"
        onClick={logOut}
      ></input>
      <section className={deleteBox}>
        <p>{deleteWarning}</p>
        <input
          type="button"
          value="no"
          onClick={() => {
            setDeleteBox("hidden");
          }}
        ></input>
        <input type="button" value="yes" onClick={removal}></input>
      </section>
    </div>
  );
}
