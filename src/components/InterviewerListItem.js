import React from "react";
import "./InterviewerListItem.scss";
const classNames = require("classnames");

export default function InterviewerListItem({
  name,
  avatar,
  selected,
  setInterviewer
}) {
  let interviewerListClass = classNames("interviewers__item", {
    "interviewers__item--selected": selected
  });

  return (
    <li
      className={interviewerListClass}
      onClick={setInterviewer}
      selected={selected}
    >
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}
