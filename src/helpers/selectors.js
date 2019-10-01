export function getAppointmentsForDay(state, day) {
  const filteredState = state.days.filter(dayName => dayName.name === day);
  const filteredAppointments =
    filteredState.length === 0 ? [] : filteredState[0].appointments;

  return filteredAppointments.length === 0
    ? []
    : filteredAppointments.map(
        appointmentId => state.appointments[appointmentId]
      );
}

export function getInterview(state, interview) {
  if (interview === null) return null;
  let interviewObj = {
    student: interview.student
  };
  const interviewerId = interview.interviewer;
  const interviewerKeys = Object.keys(state.interviewers);

  for (let interviewerKey of interviewerKeys) {
    if (state.interviewers[interviewerKey].id === interviewerId) {
      interviewObj["interviewer"] = state.interviewers[interviewerKey];
    }
  }

  return interviewObj;
}
