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
