import React, { useState, useRef, useEffect } from "react";
// import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import Calendar from "react-calendar";
import "./MonthlyCalendar.css";
import axios from "axios";

export default function MonthlyCalendar(data) {
  const [date, setDate] = useState("");
  const [scheduled, setScheduled] = useState("hidden");
  const [planNum, setPlanNum] = useState(0);
  const [planLength, setPlanLength] = useState(0);
  //console.log(data);
  // if (data.email === null) {
  //   window.location = "/account";
  // }

  //need to check if the plan is already assigned to the date
  const checkPlanScheduled = async () => {
    try {
      const result = await axios.get(
        `https://fitness-backend-je4w.onrender.com/api/${data.plan + date}`,
        {
          params: { email: data.email },
        }
      );
      //if more than one, the plan already scheduled for that day
      const planReady = result.data.data.length;
      // setPlanLength(planReady); MAY BE USE IN THE FUTURE TO CHECK THAT PLAN IS ALREADY SCHEDULED OR IF TOO MANY PLANS
      // };

      //gets all the tasks in that plan and adds it to the date
      if (planReady < 1) {
        try {
          const response = await axios.get(
            `https://fitness-backend-je4w.onrender.com/api/${data.plan}`,
            {
              params: { email: data.email },
            }
          );
          //console.log(response.data.data);
          if (response.data.data) {
            let planData = response.data.data;
            let values = "";
            for (let i = 0; i < planData.length; i++) {
              values += `('${planData[0].plan}${date}', '${planData[i].task}', '${planData[0].email}', '${date}', '${planData[0].plan_id}',FALSE )`; //,'${planData[0].plan_id}'
              if (i < planData.length - 1) {
                values += ",\n";
              }
            }
            //console.log(values);
            //sending request to add the plan to the date that we need
            try {
              const result = await axios.post(
                `https://fitness-backend-je4w.onrender.com/calendar/add`,
                {
                  values: values,
                }
              );
              data.onClick(); //closes the window usiing function from the parent component-plan.jsx
              //console.log(response);
            } catch (error) {
              //console.log("error", error);
            }
          }
        } catch (error) {
          //console.log("error", error);
        }
      } else {
        // //console.log("already scheduled for the date");
        setScheduled("scheduled");
      }
    } catch (error) {
      //console.log(error);
      // window.location = "/account";
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

  //MAY BE IN FUTURE TO SEE IF THERE ARE TOO MANY PLANS
  // const seeNumberOfPlans = async () => {
  //   //console.log(date);
  //   try {
  //     const response = await axios.get(`https://fitness-backend-je4w.onrender.com/calendar`, {
  //       params: {
  //         dates: `'${date}'`,
  //         email: data.email,
  //       },
  //     });
  //     // //console.log(response.data.data.rows);
  //     //console.log("HERE", response.data.data.rows);
  //     setPlanNum = response.data.data.rows.length;
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };

  useEffect(() => {
    // const scheduling = async () => {
    //   try {
    //     await Promise.all([checkPlanScheduled(), seeNumberOfPlans()]);
    //     //console.log(planLength);
    //     //console.log(planNum);
    //   } catch (error) {
    //     //console.log(error);
    //   }
    // };
    // scheduling();
    checkPlanScheduled();
  }, [date]);
  //console.log(data.plan);

  return (
    <>
      <Calendar next2Label={null} prev2Label={null} onClickDay={handleChange} />
      <div className={scheduled}>
        <p>Plan already scheduled for this date</p>
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
