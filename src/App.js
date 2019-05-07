import React from "react";
import "./App.css";
import Update from "./components/Update";
import Tasks from "./components/Tasks";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="App">
      <header>ברוכים הבאים לעמוד הבית של ניהול **** **** 2020</header>
      <Update />
      <div id="main">
        <div className="tasks">
          <Tasks />
        </div>
        <div className="calender">
          <Calendar />
        </div>
      </div>
      {/* <footer>Footer</footer> */}
    </div>
  );
}

export default App;
