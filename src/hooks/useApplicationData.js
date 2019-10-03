import React, { useReducer, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERIVEW";
  const SET_SPOT_COUNT = "SET_COUNT";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.value[0].data,
          appointments: action.value[1].data,
          interviewers: action.value[2].data
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.value
        };
      case SET_SPOT_COUNT:
        return {
          ...state,
          days: action.value
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const updateObjectInArray = (array, action) => {
    return array.map((item, index) => {
      if (index !== action.index) {
        return item;
      }
      return {
        ...item,
        spots: action.item
      };
    });
  };

  const getDayId = appointmentId => {
    let dayId = 0;
    if (appointmentId > 20) {
      dayId = 4;
    } else if (appointmentId > 15) {
      dayId = 3;
    } else if (appointmentId > 10) {
      dayId = 2;
    } else if (appointmentId > 5) {
      dayId = 1;
    }
    console.log(appointmentId);
    return dayId;
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, value: all });
    });
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
          console.log("State: ", state);
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          let dayId = getDayId(id);
          let days = updateObjectInArray(state.days, {
            index: dayId,
            item: state.days[dayId].spots - 1
          });

          dispatch({ type: SET_SPOT_COUNT, value: days });
          dispatch({ type: SET_INTERVIEW, value: appointments });
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
        let dayId = getDayId(id);
        let days = updateObjectInArray(state.days, {
          index: dayId,
          item: state.days[dayId].spots + 1
        });
        dispatch({ type: SET_SPOT_COUNT, value: days });
        dispatch({ type: SET_INTERVIEW, value: appointments });
      }
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};

export default useApplicationData;
