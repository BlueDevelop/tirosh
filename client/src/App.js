import React, { useState, useEffect } from "react";
import "./App.css";
import Update from "./components/Update";
import Tasks from "./components/Tasks";
import Calendar from "./components/Calendar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import SplashScreen from "./components/SplashScreen";

const MySwal = withReactContent(Swal);

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [user, setUser] = useState({});
  const hiURL = process.env.HI_URL;
  setTimeout(() => {
    setShowSplashScreen(false);
  }, 5000);

  useEffect(() => {
    const login = async () => {
      const loginUser = await axios.get("api/users/login");
      setUser(loginUser.data);
    };
    login();
  }, []);

  const [showHI, setShowHi] = useState(false);
  const styleHI = showHI
    ? {
        width: "20%",
        height: "80%",
        overflow: "hidden",
        position: "absolute",
        "z-index": "1",
        display: "block"
      }
    : {
        width: "20%",
        height: "80%",
        overflow: "hidden",
        position: "absolute",
        "z-index": "1",
        display: "none"
      };
  const hi = async () => {
    setShowHi(!showHI);
  };

  // const [state, setState] = useState({
  //   authButton: user ? (
  //     <div className="slide-out-button">
  //       <i className="icon" style={{ background: "#10d110" }}>
  //         <svg viewBox="0 0 26 26" version="1.1" width="26px" height="26px">
  //           <g id="surface1">
  //             <path d="M 7 0 C 4.789063 0 2.878906 0.917969 1.6875 2.40625 C 0.496094 3.894531 0 5.824219 0 7.90625 L 0 11 L 3 11 L 3 7.90625 C 3 6.328125 3.390625 5.085938 4.03125 4.28125 C 4.671875 3.476563 5.542969 3 7 3 C 8.460938 3 9.328125 3.449219 9.96875 4.25 C 10.609375 5.050781 11 6.308594 11 7.90625 L 11 9 L 14 9 L 14 7.90625 C 14 5.8125 13.472656 3.863281 12.28125 2.375 C 11.089844 0.886719 9.207031 0 7 0 Z M 9 10 C 7.34375 10 6 11.34375 6 13 L 6 23 C 6 24.65625 7.34375 26 9 26 L 23 26 C 24.65625 26 26 24.65625 26 23 L 26 13 C 26 11.34375 24.65625 10 23 10 Z M 16 15 C 17.105469 15 18 15.894531 18 17 C 18 17.738281 17.597656 18.371094 17 18.71875 L 17 21 C 17 21.550781 16.550781 22 16 22 C 15.449219 22 15 21.550781 15 21 L 15 18.71875 C 14.402344 18.371094 14 17.738281 14 17 C 14 15.894531 14.894531 15 16 15 Z " />
  //           </g>
  //         </svg>
  //       </i>
  //       <div
  //         className="slide-out-title"
  //         style={{ background: "#067c06" }}
  //         // onClick={logout}
  //       >
  //         {user.displayName}
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="slide-out-button">
  //       <i className="icon">
  //         <svg viewBox="0 0 26 26" version="1.1" width="26px" height="26px">
  //           <g id="surface1">
  //             <path d="M 16 0 C 13.789063 0 11.878906 0.917969 10.6875 2.40625 C 9.496094 3.894531 9 5.824219 9 7.90625 L 9 9 L 12 9 L 12 7.90625 C 12 6.328125 12.390625 5.085938 13.03125 4.28125 C 13.671875 3.476563 14.542969 3 16 3 C 17.460938 3 18.328125 3.449219 18.96875 4.25 C 19.609375 5.050781 20 6.308594 20 7.90625 L 20 9 L 23 9 L 23 7.90625 C 23 5.8125 22.472656 3.863281 21.28125 2.375 C 20.089844 0.886719 18.207031 0 16 0 Z M 9 10 C 7.34375 10 6 11.34375 6 13 L 6 23 C 6 24.65625 7.34375 26 9 26 L 23 26 C 24.65625 26 26 24.65625 26 23 L 26 13 C 26 11.34375 24.65625 10 23 10 Z M 16 15 C 17.105469 15 18 15.894531 18 17 C 18 17.738281 17.597656 18.371094 17 18.71875 L 17 21 C 17 21.550781 16.550781 22 16 22 C 15.449219 22 15 21.550781 15 21 L 15 18.71875 C 14.402344 18.371094 14 17.738281 14 17 C 14 15.894531 14.894531 15 16 15 Z " />
  //           </g>
  //         </svg>
  //       </i>
  //       <div className="slide-out-title" onClick={login}>
  //         התחבר
  //       </div>
  //     </div>
  //   )
  // });

  const svg =
    user.role == 1
      ? "M 7 0 C 4.789063 0 2.878906 0.917969 1.6875 2.40625 C 0.496094 3.894531 0 5.824219 0 7.90625 L 0 11 L 3 11 L 3 7.90625 C 3 6.328125 3.390625 5.085938 4.03125 4.28125 C 4.671875 3.476563 5.542969 3 7 3 C 8.460938 3 9.328125 3.449219 9.96875 4.25 C 10.609375 5.050781 11 6.308594 11 7.90625 L 11 9 L 14 9 L 14 7.90625 C 14 5.8125 13.472656 3.863281 12.28125 2.375 C 11.089844 0.886719 9.207031 0 7 0 Z M 9 10 C 7.34375 10 6 11.34375 6 13 L 6 23 C 6 24.65625 7.34375 26 9 26 L 23 26 C 24.65625 26 26 24.65625 26 23 L 26 13 C 26 11.34375 24.65625 10 23 10 Z M 16 15 C 17.105469 15 18 15.894531 18 17 C 18 17.738281 17.597656 18.371094 17 18.71875 L 17 21 C 17 21.550781 16.550781 22 16 22 C 15.449219 22 15 21.550781 15 21 L 15 18.71875 C 14.402344 18.371094 14 17.738281 14 17 C 14 15.894531 14.894531 15 16 15 Z "
      : "M 16 0 C 13.789063 0 11.878906 0.917969 10.6875 2.40625 C 9.496094 3.894531 9 5.824219 9 7.90625 L 9 9 L 12 9 L 12 7.90625 C 12 6.328125 12.390625 5.085938 13.03125 4.28125 C 13.671875 3.476563 14.542969 3 16 3 C 17.460938 3 18.328125 3.449219 18.96875 4.25 C 19.609375 5.050781 20 6.308594 20 7.90625 L 20 9 L 23 9 L 23 7.90625 C 23 5.8125 22.472656 3.863281 21.28125 2.375 C 20.089844 0.886719 18.207031 0 16 0 Z M 9 10 C 7.34375 10 6 11.34375 6 13 L 6 23 C 6 24.65625 7.34375 26 9 26 L 23 26 C 24.65625 26 26 24.65625 26 23 L 26 13 C 26 11.34375 24.65625 10 23 10 Z M 16 15 C 17.105469 15 18 15.894531 18 17 C 18 17.738281 17.597656 18.371094 17 18.71875 L 17 21 C 17 21.550781 16.550781 22 16 22 C 15.449219 22 15 21.550781 15 21 L 15 18.71875 C 14.402344 18.371094 14 17.738281 14 17 C 14 15.894531 14.894531 15 16 15 Z ";
  const iStyle = {
    background: user.role == 1 ? "#07f707" : "#b50027"
  };
  const divStyle = {
    background: user.role == 1 ? "#00cc00" : "#78001a"
  };
  if (showSplashScreen) return SplashScreen();
  return (
    <div className="App">
      {/* {state.authButton} */}
      <div className="slide-out-button">
        <i className="icon" style={iStyle}>
          <svg viewBox="0 0 26 26" version="1.1" width="26px" height="26px">
            <g id="surface1">
              <path d={svg} />
            </g>
          </svg>
        </i>
        <div className="slide-out-title" style={divStyle}>
          {user.name}
        </div>
      </div>
      <div className="slide-out-button-Hi">
        <i className="icon">
          <img id="Hi" src="Hi.png" onClick={hi} />
        </i>
      </div>

      <header>
        <div class="header-container">
          <div class="welcome">
            <img id="symbol" src="symbol.png" />
            <p>ברוכים הבאים לעמוד הבית של ניהול **** **** 2020</p>
            <img id="krypton" src="krypton.png" />
          </div>
          <div class="icu-link">
            <a rel="noopener noreferrer" target="_blank" href="icu.url">
              <img id="icu" srv="icu.png" />
            </a>
            <a rel="noopener noreferrer" target="_blank" href="momentum.url">
              <img id="momentum" srv="momentum.png" />
            </a>
          </div>
        </div>
      </header>

      <Update user={user} />
      <div id="main">
        <iframe id="chat-frame" src="" style={styleHI} z-index="1">
          &lt;br /&gt;
        </iframe>
        <div className="tasks">
          <Tasks user={user} />
        </div>
        <div className="calender">
          <Calendar user={user} />
        </div>
      </div>
      {/* <footer>Footer</footer> */}
    </div>
  );
}

export default App;
