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

  useEffect(() => {
    tokenLogging();
  }, []);

  for (let i = 0; i < week.length; i++) {
    // console.log(format(week[i], "yyyy-mm-dd"));
    let date = new Date(week[i]);
    let formattedDate = date.toISOString().slice(0, 10);

    if (i === week.length - 1) {
      dates += `'${formattedDate}'`;
    } else {
      dates += `'${formattedDate}', `;
    }
  }
  console.log(data);

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
        // return response.data; //return value for fetchAPI

        //window.location = "/plans";
      } else {
        window.location = "/account";
      }
    } catch (error) {
      console.log(error);
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
    try {
      const response = await axios.get(`http://localhost:3001/calendar`, {
        params: {
          dates: dates,
          email: email,
        },
      });
      // console.log(response.data.data.rows);
      setData(response.data.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchAPI();
    }
  }, [dates, email]);

  useEffect(() => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    setWeek(days);
  }, [currentDate]);

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  //deletes the specific plan scheduled for that day
  const deleteScheduledPlan = async (planDates) => {
    console.log("clicked");
    try {
      const response = await axios.delete(
        `http://localhost:3001/calendar/${planDates.plan}`
      );
      fetchAPI(); //called to refresh the page
      console.log(response);
    } catch (error) {
      console.log(error);
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

    const planDates = data.find(
      (d) => d.date_scheduled.slice(8, 10) === format(day, "dd")
    );
    const date = new Date(day);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    //if plan is scheduled, then it is shown
    if (planDates) {
      return (
        <div key={day.toString()} className="day">
          <div className={findToday()}>
            <h2>{format(day, "dd")}</h2>
            {dayName}
          </div>

          {/* plan that is scheduled for that day */}
          <section className="dailyTask">
            <Link to={`/create/${planDates.plan}`} className="scheduledPlan">
              {/* <div className="scheduledPlan"> */}
              {planDates.plan.slice(0, -10)}
              {/* </div> */}
            </Link>
            <div
              className="delete"
              onClick={() => deleteScheduledPlan(planDates)}
            >
              Delete
            </div>
          </section>
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
        </div>
      );
    }
  });
  console.log(week[0]);

  const time = (index) => {
    const date = new Date(week[index]);
    const day = date.getDate();
    return day;
  };

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon icon-tabler icons-tabler-filled icon-tabler-caret-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" />
          </svg>
        </button>
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={goToNextWeek}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon icon-tabler icons-tabler-filled icon-tabler-caret-right"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
          </svg>
        </button>
      </div>
      <div className="calendar-body">
        <div className="week">{spreadPlan}</div>
      </div>
    </div>
  );
};

export default Calendar;
