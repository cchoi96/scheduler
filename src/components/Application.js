import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors.js";
import axios from "axios";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  const getDaysData = axios.get("/api/days");
  const getAppointmentData = axios.get("/api/appointments");
  const getInterviewersData = axios.get("/api/interviewers");

  const interviewers = getInterviewersForDay(state, state.day);

  useEffect(() => {
    Promise.all([getDaysData, getAppointmentData, getInterviewersData]).then(
      all => {
        const [days, appointments, interviewers] = all;
        setState(prev => ({
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data
        }));
      }
    );
  }, []);

  const bookInterview = (id, interview) => {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          setState({ ...state, appointments });
        }
      });
  };

  const cancelInterview = id => {
    return axios.delete(`/api/appointments/${id}`).then(response => {
      if (response.status >= 200 && response.status < 300) {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        setState({ ...state, appointments });
      }
    });
  };

  const scheduleData = getAppointmentsForDay(state, state.day).map(
    appointment => {
      return (
        <Appointment
          id={appointment.id}
          time={appointment.time}
          interview={getInterview(state, appointment.interview)}
          interviewers={interviewers}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
          key={appointment.id}
        />
      );
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        <ul>{scheduleData}</ul>
      </section>
    </main>
  );
}
