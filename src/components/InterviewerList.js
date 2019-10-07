import React from "react";
import "./InterviewerList.scss";
import InterviewerListItem from "./InterviewerListItem";
import PropTypes from "prop-types";
const classNames = require("classnames");

export default function InterviewerList({ interviewers, value, onChange }) {
  const interviewersData = interviewers.map(interviewerData => {
    return (
      <InterviewerListItem
        key={interviewerData.id}
        name={interviewerData.name}
        avatar={interviewerData.avatar}
        selected={value === interviewerData.id}
        setInterviewer={() => onChange(interviewerData.id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interview</h4>
      <ul className="interviewers__list">{interviewersData}</ul>
    </section>
  );
}

InterviewerList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
