import React, { useState, useEffect } from "react";
import "./Update.css";
import Marquee from "react-text-marquee";
import axios from "axios";
import Ticker from "react-ticker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Update() {
  const [updates, setUpdates] = useState([]);
  useEffect(async () => {
    const result = await axios("api/updates/all");
    setUpdates(result.data.updates);
  }, []);

  // Swal.fire({
  //   title: '<strong>HTML <u>example</u></strong>',
  //   type: 'info',
  //   html:
  //     'You can use <b>bold text</b>, ' +
  //     '<a href="//github.com">links</a> ' +
  //     'and other HTML tags',
  //   showCloseButton: true,
  //   showCancelButton: true,
  //   focusConfirm: false,
  //   confirmButtonText:
  //     '<i class="fa fa-thumbs-up"></i> Great!',
  //   confirmButtonAriaLabel: 'Thumbs up, great!',
  //   cancelButtonText:
  //     '<i class="fa fa-thumbs-down"></i>',
  //   cancelButtonAriaLabel: 'Thumbs down',
  // })

  const handleClick = async () => {
    const { value: text } = await Swal.fire({
      input: "text",
      inputPlaceholder: "Type your message here...",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });

    if (text) {
      Swal.fire(`Your update is ${text}`);
      const result = await axios.post("api/updates", {
        update: { text: text }
      });
      setUpdates([...updates, { text }]);
    }
  };
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
