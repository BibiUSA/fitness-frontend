import "./Plans.css";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MonthlyCalendar from "../../components/MonthlyCalendar";
import { event } from "jquery";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

export default function Plans() {
  const [hideBox, setHideBox] = useState("hidden"); //class to hide add Plan Box
  const [deleteBox, setDeleteBox] = useState("hidden deleteButton"); //classes to hide deletButton
  const [newPlanInput, setNewPlanInput] = useState(""); //the input typed into a the plan name
  const [editButton, setEditButton] = useState("Edit"); //changes between edit and done to allow plan editing
  const [totalPlans, setTotalPlans] = useState([1]); //total number of plans
  const [plansAdded, setPlansAdded] = useState(0); //used to refetch full data
  const [search, setSearch] = useState(""); //search box input
  const [planWarning, setPlanWarning] = useState("hidden"); //
  const [deleteWarning, setDeleteWarning] = useState("hidden"); //
  const [warningMessage, setWarningMessage] = useState(
    //changes warning message if no plan input vs plan already exists
    "Plan already exists.Try a different name."
  );
  const [addBlue, setAddBlue] = useState("newPlanButtons gray"); //changes add button to blue when there's an input
  const [delPlan, setDelPlan] = useState();
  const [delPlanId, setDelPlanId] = useState();
  const [email, setEmail] = useState(null);
  const [showCalendar, setShowCalendar] = useState("hidden");
  const [calendarPlan, setCalendarPlan] = useState("");
  function handleChange(event) {
    setNewPlanInput(event.target.value);
    if (newPlanInput.length > 1) {
      setAddBlue("newPlanButtons blue");
    } else {
      setAddBlue("newPlanButtons gray");
    }
  }

  // useEffect(() => {

  // }, []);

  //checks to see if token is there.
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
        console.log(response.data);
        setEmail(response.data.email);
        return response.data; //return value for fetchAPI
      } else {
        window.location = "/account";
      }
    } catch (error) {
      console.log(error);
    }
  };

  //gets all the plans
  const fetchAPI = async () => {
    const userEmail = await tokenLogging(); //checks to make sure tokenLogging is ran first fully
    if (userEmail) {
      const response = await axios.get(
        "http://localhost:3001/plans",

        {
          params: { email: userEmail.email },
        }
      );
      setTotalPlans(response.data.data);
      console.log(userEmail.email);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [plansAdded]);

  console.log(totalPlans);
  console.log(delPlanId);

  const removePlan = async () => {
    setDeleteWarning("hidden");

    try {
      const response = await axios.delete(
        `http://localhost:3001/plans/${delPlanId}`
      );
      setPlansAdded(plansAdded + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const planSpread = totalPlans.map((obj) => {
    if (obj === 1) {
      return;
    } else if (obj.plan.toLowerCase().includes(search.toLowerCase())) {
      return (
        <>
          <div className="eachPlansDiv">
            <div className="eachPlansLine">
              <input
                type="button"
                value="-"
                className={deleteBox}
                onClick={() => getConfirmation(obj)}
                id={obj.task_id + "d"}
              ></input>
              <Link to={`/create/${obj.plan}`} className="plansLink">
                <li id={obj.task_id} className="eachPlans">
                  {obj.plan}
                </li>
              </Link>
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
                className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-plus scheduleIcon"
                onClick={() => calendarClick(obj.plan)}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
              </svg>
            </div>

            <hr className="hr"></hr>
          </div>
        </>
      );
    }
  });

  //TRYING TO FIGURE OUT HOW TO DELETE THE WHOLE PLAN INCLUDING SCHEDULED DATES. HAVING TROUBLE SENDING PLAN ID AND DELETING BASED ON JUST THE ID
  function getConfirmation(obj) {
    console.log(obj.plan_id);
    let id = obj.plan_id;
    setDelPlanId(`${id}`);
    setDelPlan(obj.plan);

    setDeleteWarning("confirmDelete");
  }

  const planExist = () => {
    for (let i = 0; i < totalPlans.length; i++) {
      if (totalPlans[i].plan === newPlanInput) {
        return true;
      }
    }
    return false;
  };

  //sends new plan data to the database
  const addPlan = async (event) => {
    if (planExist() === true) {
      setPlanWarning("planExistWarning");
      setWarningMessage("Plan already exists.Try a different name.");
      return;
    } else if (newPlanInput.length < 1) {
      setPlanWarning("planExistWarning");
      setWarningMessage("Enter a plan name.");
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:3001/plans", {
          plan: newPlanInput,
          task: "1995ActuallyAPlan", //used only for plans
        });
        console.log(response);
      } catch (error) {
        console.log("error", error);
      }
      cancel();
      setPlansAdded(plansAdded + 1);
    }
  };

  function showBox() {
    setHideBox("");
  }

  function cancel() {
    setNewPlanInput("");
    setHideBox("hidden");
    setPlanWarning("hidden");
  }

  function edit(event) {
    if (deleteBox === "hidden deleteButton") {
      setDeleteBox("deleteButton");
      setEditButton("Done");
    } else {
      setDeleteBox("hidden deleteButton");
      setEditButton("Edit");
    }
  }

  function searching(event) {
    console.log(event.target.value);
    setSearch(event.target.value);
  }

  function calendarClick(item) {
    console.log(item);
    setCalendarPlan(item);
    console.log("calendar plan", calendarPlan);
    setShowCalendar("scheduleCalendar");
  }

  return (
    <>
      <div className="searchSection">
        <input
          type="textarea"
          placeholder="Search"
          name="search"
          id="search"
          className="SearchBar"
          value={search}
          onChange={searching}
        ></input>
        <label htmlFor="search"></label>
      </div>
      <h1 className="planTitle">Plans</h1>
      <div id="allPlans">
        <input
          type="button"
          value={editButton}
          className="editButton"
          onClick={edit}
        ></input>
        {planSpread}
        <input
          type="button"
          id="addPlan"
          name="addPlan"
          value={"+"}
          onClick={showBox}
        ></input>

        <div id="newPlanBox" className={hideBox}>
          <div id="newPlanButtons">
            <input
              type="button"
              className="newPlanButtons"
              id="cancelNewPlan"
              value="Cancel"
              onClick={cancel}
            ></input>

            <input
              type="button"
              className={addBlue}
              id="addNewPlan"
              value="Add"
              onClick={addPlan}
            ></input>
          </div>
          <input
            type="textarea"
            placeholder="Enter Plan Name"
            id="newPlan"
            name="newPlan"
            value={newPlanInput}
            onChange={handleChange}
          ></input>
          <label htmlFor="newPlan"></label>
          <p className={planWarning}>{warningMessage}</p>
        </div>
        <div className={deleteWarning}>
          <p>
            Delete plan "{delPlan}"? This will delete all the dates this plan is
            scheduled.
          </p>
          <input
            type="button"
            value="cancel"
            className="confirmButton cancelConfirm"
            onClick={() => setDeleteWarning("hidden")}
          ></input>
          <input
            type="button"
            value="yes"
            className="confirmButton yesConfirm"
            onClick={removePlan}
          ></input>
        </div>
        <div className={showCalendar}>
          <div className="scheduleCalendarTitle">
            <h2>{calendarPlan}</h2>
            <button onClick={() => setShowCalendar("hidden")}>Cancel</button>
          </div>
          <MonthlyCalendar
            plan={calendarPlan}
            email={email}
            onClick={() => setShowCalendar("hidden")}
          />
          {/* <Calendar /> */}
        </div>
      </div>
    </>
  );
}
