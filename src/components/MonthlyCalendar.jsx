import React, { useState, useRef, useEffect } from "react";
// import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import Calendar from "react-calendar";
import "./MonthlyCalendar.css";
import axios from "axios";

export default function MonthlyCalendar(data) {
  const [date, setDate] = useState("");
  const [scheduleMess, setScheduleMess] = useState(
    "Plan already scheduled for this date"
  );
  const [scheduled, setScheduled] = useState("hidden");
  const [planNum, setPlanNum] = useState(0);
  const [planLength, setPlanLength] = useState(0);
  //console.log(data);
  //console.log("DATE", date);
  // if (data.email === null) {
  //   window.location = "/account";
  // }

  const checkPlanScheduled = async () => {
    try {
      const result = await axios.get(
        `https://fitness-backend-je4w.onrender.com/api/check/${
          data.plan + date
        }`,
        {
          params: { email: data.email, date: date },
        }
      );
      const finalResult = result.data;
      if (finalResult === true) {
        setScheduleMess("Plan already scheduled for this date");
        setScheduled("scheduled");
      } else if (finalResult === false) {
        setScheduleMess("3 plans per day limit reached.");
        setScheduled("scheduled");
      } else {
        //console.log(finalResult);
        data.onClick();
      }
    } catch (error) {
      //console.log(error);
    }
  };

  //when clicked, the date gets set. Which triggers the function to check if the plan is already scheduled.
  function handleChange(event) {
    //console.log(event.toISOString().split("T")[0]);
    setDate(event.toISOString().split("T")[0]); //need to wait till this state is set
    //need to comment this out so the date is goint through

    //get from database, the tasks with "plan" as the property, where the email is the
    //email we have
    //from there, insert into the fitness_task joined plan dates database a new task for each one, set the
    //task name as the same, email same, plan id will be different, plan name will be
    //plan name plus thedate, completed should default to false, new_task will be the
    //same as task name
  }

  useEffect(() => {
    if (date.length < 1) {
      return;
    }
    checkPlanScheduled();
  }, [date]);
  //console.log(data.plan);

  return (
    <>
      <Calendar next2Label={null} prev2Label={null} onClickDay={handleChange} />
      <div className={scheduled}>
        <p>{scheduleMess}</p>
        <input
          type="button"
          value="ok"
          onClick={() => {
            setScheduled("hidden");
          }}
        ></input>
      </div>
    </>
  );
}
