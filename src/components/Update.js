import React, { useState } from "react";
import "./Update.css";
import Marquee from "react-text-marquee";

function Update() {
  const [updates, setUpdates] = useState([
    {
      text: "מתקיים החלק השני של סדנת הערכת המצב ",
      date: new Date()
    },
    {
      text: "מתקיים החלק השני של סדנת הערכת המצב ",
      date: new Date()
    },
    {
      text: "מתקיים החלק השני של סדנת הערכת המצב ",
      date: new Date()
    },
    {
      text: "מתקיים החלק השני של סדנת הערכת המצב ",
      date: new Date()
    },
    {
      text: "מתקיים החלק השני של סדנת הערכת המצב ",
      date: new Date()
    }
  ]);

  return (
    <div className="update">
      <div className="update-title">עידכונים</div>
      <Marquee
        className="update-marquee"
        text={updates.map(update => update.text).join(" | ")}
        loop={true}
        hoverToStop={true}
      />
    </div>
  );
}

export default Update;
