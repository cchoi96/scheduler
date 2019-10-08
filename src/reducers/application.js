const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const UPDATE_SPOTS_REMAINING = "UPDATE_SPOTS_REMAINING";
export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview && { ...action.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      return {
        ...state,
        appointments
      };
    case UPDATE_SPOTS_REMAINING:
      let dayid = 0;
      if (action.id < 6) {
        dayid = 0;
      } else if (action.id < 11) {
        dayid = 1;
      } else if (action.id < 16) {
        dayid = 2;
      } else if (action.id < 21) {
        dayid = 3;
      } else if (action.id < 26) {
        dayid = 4;
      }
      let newdays = state.days.map((item, index) => {
        if (index !== dayid) {
          return item;
        }
        return {
          ...item,
          spots: state.days[dayid].spots + action.val
        };
      });
      return { ...state, days: newdays };
    default:
      throw new Error("Tried to use unsupported action type " + action.type);
  }
}

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, UPDATE_SPOTS_REMAINING };
