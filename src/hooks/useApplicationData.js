import { useReducer, useEffect } from "react";
import axios from "axios";
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS_REMAINING
} from "../reducers/application.js";

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then(all =>
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        })
      )
      .catch(err => console.log(err));
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview) {
    // If no interview in state, update days
    if (!state.appointments[id].interview) {
      updateDays(id, -1);
    }
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(dispatch({ type: SET_INTERVIEW, id, interview }));
  }

  function cancelInterview(id, interview) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(dispatch({ type: SET_INTERVIEW, id, interview: null }))
      .then(updateDays(id, 1));
  }

  function updateDays(id, val) {
    dispatch({
      type: UPDATE_SPOTS_REMAINING,
      id,
      val
    });
  }
  return { state, setDay, bookInterview, cancelInterview };
};
export default useApplicationData;
