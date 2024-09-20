import "./Account.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// import api from "../../api";

export default function Account() {
  const [email, setEmail] = useState("");

  console.log(email);
  useEffect(() => {
    loggingIn();
  }, [email]);

  const loggingIn = async () => {
    console.log("logging In");
    if (email.length > 0) {
      console.log("email sent");
      try {
        const response = await axios.post(
          "http://localhost:3001/account",
          {
            email: email,
          },
          { withCredentials: true }
        );
        console.log(response);
        localStorage.setItem("auth_token", response.data.token);

        window.location = "/";
      } catch (error) {
        console.log(error);
        npm;
      }
    }
  };

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
        console.log(response.data.email);
        setEmail(response.data.email);
      }
      // window.location = "/settings";
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    tokenLogging();
  }, []);

  return (
    <div className="accountPage">
      <div className="accountBox">
        <h2>Make a Plan.</h2>
        <h2>Hit your Goals.</h2>
        <img src="/public/assets/gym.jpeg" id="illustration" />

        <p>Log in to get started!</p>
        <div className="google">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              let credentialResponseDecoded = jwtDecode(
                credentialResponse.credential
              );
              setEmail(credentialResponseDecoded.email);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}
