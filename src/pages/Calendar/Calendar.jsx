import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, subWeeks, addWeeks } from "date-fns";
import "./Calendar.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [week, setWeek] = useState([]);
  const [email, setEmail] = useState([]);
  let dates = "";
  const [data, setData] = useState([]);
  const [hideBox, setHideBox] = useState("hidden"); //class to hide add Plan Box
  const [addBlue, setAddBlue] = useState("newPlanButtons gray"); //changes add button to blue when there's an input
  const [newPlanInput, setNewPlanInput] = useState(""); //the input typed into a the plan name
  const [planWarning, setPlanWarning] = useState("hidden"); //
  const [warningMessage, setWarningMessage] = useState(
    //changes warning message if no plan input vs plan already exists
    "Plan already exists.Try a different name."
  );
  const [plansAdded, setPlansAdded] = useState(0); //used to refetch full data
  const [holdDate, setHoldDate] = useState("");

  useEffect(() => {
    tokenLogging();
  }, []);

  for (let i = 0; i < week.length; i++) {
    // //console.log(format(week[i], "yyyy-mm-dd"));
    let date = new Date(week[i]);
    let formattedDate = date.toISOString().slice(0, 10);

    if (i === week.length - 1) {
      dates += `'${formattedDate}'`;
    } else {
      dates += `'${formattedDate}', `;
    }
  }
  //console.log(data);

  const tokenLogging = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      if (token != null) {
        const response = await axios.post(
          `https://fitness-backend-je4w.onrender.com/account/protect`,
          {},
          {
            headers: headers,
          }
        );
        //console.log(response.data.email);
        setEmail(response.data.email);
        // return response.data; //return value for fetchAPI

        //window.location = "/plans";
      } else {
        window.location = "/account";
      }
    } catch (error) {
      //console.log(error);
      window.location = "/account";
    }
  };

  //   const events = week.map((day) => {
  //     <div key={day.toString()} className="day">
  //       <div className="date">{format(day, "d")}</div>
  //       {/* You can add events or other content for each day here */}
  //     </div>;
  //   });

  //to get data of all plans in the dates

  const fetchAPI = async () => {
    //console.log(dates);
    try {
      const response = await axios.get(
        `https://fitness-backend-je4w.onrender.com/calendar`,
        {
          params: {
            dates: dates,
            email: email,
          },
        }
      );
      //console.log(response.data.data.rows);
      setData(response.data.data.rows);
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchAPI();
    }
  }, [dates, email, plansAdded]);

  useEffect(() => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    setWeek(days);
  }, [currentDate]);

  function showBox(day) {
    let dateNow = new Date(day).toISOString().slice(0, 10);
    setHoldDate(dateNow);
    setHideBox("addDayPlanBox");
  }

  function cancel() {
    setNewPlanInput("");
    setHideBox("hidden");
    setPlanWarning("hidden");
  }

  //when addplan  input has a value, changes color of add button
  function handleChange(event) {
    setNewPlanInput(event.target.value);
    if (newPlanInput.length > 0) {
      setAddBlue("newPlanButtons blue");
    } else {
      setAddBlue("newPlanButtons gray");
    }
  }

  //adds the plan to the specific date
  const addPlan = async (event) => {
    if (newPlanInput.length < 1) {
      setPlanWarning("planExistWarning");
      setWarningMessage("Enter a plan name.");
      return;
    } else {
      //console.log(holdDate);
      for (let i = 0; i < data.length; i++) {
        if (data[i].plan === `${newPlanInput}${holdDate}`) {
          setPlanWarning("planExistWarning");
          setWarningMessage("Plan already exists.Try a different name.");
          return;
        }
      }
      try {
        const response = await axios.post(
          `https://fitness-backend-je4w.onrender.com/plans/datePlan/`,
          {
            plan: `${newPlanInput}${holdDate}`,
            task: "1995ActuallyAPlan",
            date: holdDate,
            email: email,
          }
        );
        //console.log(response);
        window.location = `/create/${newPlanInput}${holdDate}`;
      } catch (error) {
        //console.log("error", error);
      }
      cancel();
      setPlansAdded(plansAdded + 1);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  //deletes the specific plan scheduled for that day
  const deleteScheduledPlan = async (planDates) => {
    //console.log(planDates);
    try {
      const response = await axios.delete(
        `https://fitness-backend-je4w.onrender.com/calendar/${planDates.plan}`
      );
      fetchAPI(); //called to refresh the page
      //console.log(response);
    } catch (error) {
      //console.log(error);
    }
  };

  //spreads the dates and if there is a plan scheduled for that date, then it is entered as well
  const spreadPlan = week.map((day) => {
    const thisDay = day.toLocaleDateString("en-US");
    const today = new Date().toLocaleDateString("en-US");
    //to find today and give it a color on the calendar
    const findToday = () => {
      if (thisDay === today) {
        return "today";
      } else {
        return "date";
      }
    };

    // const planDates = data.find(
    //   (d) => d.date_scheduled.slice(8, 10) === format(day, "dd")
    // );
    const hasTask = [];
    data.forEach((d) => {
      if (d.date_scheduled.slice(8, 10) === format(day, "dd")) {
        hasTask.push(d);
      }
    });

    // //console.log("planDates", planDates);

    const date = new Date(day);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    //if plan is scheduled, then it is shown
    if (hasTask.length == 3) {
      return (
        <div key={day.toString()} className="day">
          <div className={findToday()}>
            <h2>{format(day, "dd")}</h2>
            {dayName}
          </div>

          {hasTask.map((item) => {
            return (
              <section className="dailyTask">
                <Link to={`/create/${item.plan}`} className="scheduledPlan">
                  {/* <div className="scheduledPlan"> */}
                  {item.plan.slice(0, -10)}
                  {/* </div> */}
                </Link>
                <div
                  className="delete"
                  onClick={() => deleteScheduledPlan(item)}
                >
                  Delete
                </div>
              </section>
            );
          })}
        </div>
      );
      //if less than 3 plans
    } else if (hasTask.length > 0) {
      return (
        <div key={day.toString()} className="day">
          <div className={findToday()}>
            <h2>{format(day, "dd")}</h2>
            {dayName}
          </div>

          {hasTask.map((item) => {
            return (
              <section className="dailyTask">
                <Link to={`/create/${item.plan}`} className="scheduledPlan">
                  {/* <div className="scheduledPlan"> */}
                  {item.plan.slice(0, -10)}
                  {/* </div> */}
                </Link>
                <div
                  className="delete"
                  onClick={() => deleteScheduledPlan(item)}
                >
                  Delete
                </div>
              </section>
            );
          })}
          <input
            type="button"
            className="addDayPlan"
            value="+"
            onClick={() => {
              showBox(day);
            }}
          ></input>
        </div>
      );
    } else {
      //if plan isn't scheduled for that date
      return (
        <div key={day.toString()} className="day">
          <div className={findToday()}>
            <h2>{format(day, "dd")}</h2>
            {dayName}
          </div>
          <input
            type="button"
            className="addDayPlan"
            value="+"
            onClick={() => {
              showBox(day);
            }}
          ></input>
        </div>
      );
    }
  });

  //console.log(data);
  //console.log(week[0]);

  const time = (index) => {
    const date = new Date(week[index]);
    const day = date.getDate();
    return day;
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <button className="nextprev" onClick={goToPreviousWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-caret-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" />
          </svg>
        </button>
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
        <button className="nextprev" onClick={goToNextWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-caret-right"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
          </svg>
        </button>
      </div>
      <div className="calendar-body">
        <div className="week">{spreadPlan}</div>

        {/* box to add the enter the new plan */}
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
      </div>
    </div>
  );
};

export default Calendar;
