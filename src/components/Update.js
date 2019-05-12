import React, { useState, useEffect } from "react";
import "./Update.css";
import Marquee from "react-text-marquee";
import axios from "axios";
import Ticker from "react-ticker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Update() {
  const inputValue = "";
  const [updates, setUpdates] = useState([]);
  useEffect(async () => {
    const result = await axios("http://localhost:8000/api/updates/all");
    setUpdates(result.data.updates);
  }, []);

  function handleClick() {
    const { value: update } = Swal.fire({
      title: "Enter your update text",
      input: "text",
      inputValue: inputValue,
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });

    if (update) {
      Swal.fire(`Your IP address is ${update}`);
    }
  }
  return (
    <div className="update" onClick={handleClick}>
      <div className="update-title">עידכונים</div>
      {/* <Marquee
        className="update-marquee"
        text={updates.map(update => update.text).join(" | ")}
        loop={true}
        hoverToStop={true}
      /> */}
      <p className="marquee">
        <span>{updates.map(update => update.text).join(" | ")}</span>
      </p>
    </div>
  );
}

export default Update;
