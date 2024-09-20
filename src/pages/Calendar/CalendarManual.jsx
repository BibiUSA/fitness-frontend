import "./CalendarManual.css";
import { useState, useContext, useEffect } from "react";

export default function CalendarManual() {
  const today = new Date();
  let dayToday = today.getDay();
  let date = useState(today.getDate());
  let month = today.getMonth();
  let year = today.getFullYear();
  const [clickedDate, setClickedDate] = useState();
  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOne = new Date(year, month, 1);
  const dayOneDay = dayOne.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const monthLength = lastDay.getDate();
  console.log(dayOne, "+", dayOneDay, "+", lastDay, "+", monthLength);
  const emptyDatesArr = []; //main purpose is it to use it to map the empty div
  const monthDatesArr = []; //main purpose to map to create the divs with numbers

  for (let i = 0; i < dayOneDay; i++) {
    emptyDatesArr.push("eachDay");
  }

  const emptyDays = emptyDatesArr.map((item) => {
    return <div className={item} onClick={logDay}></div>;
  });

  for (let i = 0; i < monthLength; i++) {
    monthDatesArr.push(i + 1);
  }

  const monthDays = monthDatesArr.map((item) => {
    if (item === date) {
      return (
        <div className="eachDay current-date" onClick={logDay}>
          {item}
        </div>
      );
    } else {
      return (
        <div className="eachDay" onClick={logDay}>
          {item}
        </div>
      );
    }
  });

  function logDay(event) {
    setClickedDate(event.target.innerText);
  }

  // function previousMonth() {
  //   setEmptyDatesArr[""];
  //   setMonthDatesArr[""];
  //   setClickedDate("");

  console.log(emptyDatesArr);
  return (
    <>
      <div className="calendar">
        <header>
          <div className="display">
            <p className="todayDate">
              <strong>{date}</strong>
            </p>
            <div className="todayAndMonth">
              <p>{week[dayToday]}</p>
              <p>
                {monthName[month]} {year}
              </p>
            </div>
          </div>
          <div className="changeMonth">
            <button className="previous">Prev</button>
            <button className="next">Next</button>
          </div>
        </header>
        <div className="week">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="days">
          {emptyDays}
          {monthDays}
        </div>
      </div>
      <div className="selectedDiv">
        <p className="selected">{clickedDate}</p>
      </div>
    </>
  );
}
