import "./Create.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Create() {
  const createArray = [];
  const [email, setEmail] = useState(null);
  function stopRefresh(event) {
    console.log(event);
  }

  const { plan } = useParams();
  console.log(plan);

  const [backendData, setBackendData] = useState([1]);
  const [inputValue, setInputValue] = useState("");
  // const [changePlan, setChangePlan] = useState(plan);
  const planName = plan;
  const fetchAPI = async () => {
    const userEmail = await tokenLogging();
    if (userEmail) {
      const response = await axios.get(`http://localhost:3001/api/${plan}`, {
        params: { email: userEmail.email },
      });
      setBackendData(response.data.data);
      console.log(response.data.data);
    }
  };

  const tokenLogging = async () => {
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
        return response.data; //return value for fetchAPI

        //window.location = "/plans";
      } else {
        window.location = "/account";
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  console.log(backendData);

  // axios.post("/create", {});
  //sends data to back end and data base
  const handleChange = async (event) => {
    if (event.key === "Enter") {
      console.log("sending");
      try {
        const response = await axios.post("http://localhost:3001/api/create", {
          data: event.target.value,
          plan: planName,
          plan_id: backendData[0].plan_id,
          email: backendData[0].email,
        });

        console.log(response);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleDelete = async (event) => {
    console.log(event.target.id);
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/${event.target.id}`,
        {
          data: { id: event.target.id },
        }
      );
      console.log(response);
      fetchAPI();
    } catch (error) {
      console.log("error: ", error);
    }
  };
  console.log(backendData);

  //spreads out the todo tasks
  const toDoTasks = backendData.map((obj) => {
    if (obj.task !== "1995ActuallyAPlan") {
      return (
        <div key={obj.task_id} className="toDoTasks">
          <input
            type="checkbox"
            id={obj.task_id}
            name={obj.task_id}
            onClick={handleDelete}
          ></input>
          <label htmlFor={obj.task_id}>{obj.task}</label>
          <br></br>
        </div>
      );
    }
  });

  function planChange(event) {
    set;
  }

  return (
    <div id="Create">
      <h1 className="planName">{planName}</h1>
      <div id="planMaker">
        {/* <input type="text" className="planName" value={planChange} />  future feature  */}
        <form>
          <input
            type="text"
            name="newAction"
            id="newAction"
            placeholder="ADD NEW TASKS"
            onKeyDown={handleChange}
          ></input>
        </form>
        <hr className="line"></hr>
        <p></p>
        {toDoTasks}
      </div>
    </div>
  );
}
