import React, { useState, useEffect } from "react";
import "./Update.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Modal from "react-awesome-modal";

const MySwal = withReactContent(Swal);

function Update(props) {
  const user = props.user;
  const [updates, setUpdates] = useState([]);
  const [visible, setVisible] = useState(false);
  useEffect(async () => {
    const result = await axios("api/updates/all");
    setUpdates(result.data.updates);
  }, []);

  const handleClick = async () => {
    if (user.role != 1) {
      return;
    }
    const { value: text } = await Swal.fire({
      input: "text",
      inputPlaceholder: "הקלד את העידכון כאן...",
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return "חייב לכתוב משהו!";
        }
      }
    });

    if (text) {
      Swal.fire(`העידכון הוא ${text}`);
      const result = await axios.post("api/updates", {
        update: { text: text }
      });
      setUpdates([...updates, result.data.update]);
    }
  };
  const handleRemoveUpdate = async update => {
    if (!localStorage.hasOwnProperty("user")) {
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });

    swalWithBootstrapButtons
      .fire({
        title: "האם אתה בטוח?",
        html: `העידכון הוא ${update.text}`,
        text: "לא תוכל להתחרט!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "כן, מחק!",
        cancelButtonText: "לא, בטל!",
        reverseButtons: true
      })
      .then(async result => {
        if (result.value) {
          const result = await axios.delete(`api/updates/delete/${update._id}`);
          if (result) {
            const valueToRemove = update._id;
            const newArray = updates.filter(item => item._id !== valueToRemove);
            setUpdates(newArray);
            swalWithBootstrapButtons.fire(
              "נמחק!",
              "העידכון נמחק בהצלחה",
              "success"
            );
          }
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("בוטל", "העידכון לא נמחק", "error");
        }
      });
  };
  const openModal = () => {
    if (user.role != 1) {
      return;
    }
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };
  return (
    <div className="update">
      <div className="update-title" onClick={openModal}>
        עידכונים
      </div>
      <p className="marquee" onClick={handleClick}>
        <span>{updates.map(update => update.text).join(" | ")}</span>
      </p>
      <Modal
        visible={visible}
        height="400"
        width="800"
        effect="fadeInUp"
        onClickAway={closeModal}
      >
        <ul className="ul-update">
          {updates.map(update => {
            return (
              <li className="li-update">
                <span
                  className="close"
                  onClick={() => handleRemoveUpdate(update)}
                >
                  &times;
                </span>
                {update.text}
              </li>
            );
          })}
        </ul>
      </Modal>
    </div>
  );
}

export default Update;
