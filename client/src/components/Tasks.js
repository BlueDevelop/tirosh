import React, { useState, useEffect } from "react";
import "./Tasks.css";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import moment from "moment";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  // const [gridApi,setGridApi] = userState(null);

  useEffect(async () => {
    const result = await axios("api/tasks");
    result.data.tasks.map(task => {
      task.due = task.due
        ? (task.due = moment(task.due).format("DD/MM/YYYY"))
        : task.due;
    });
    setTasks(result.data.tasks);
  }, []);

  const onRowClicked = event => {
    const url = "https://www.google.com";
    let win = window.open(url, "_blank");
    win.focus();
  };

  // const cellMouseOver = () => {
  //   document.body.style.cursor = "pointer";
  // };

  // const cellMouseOut = () => {
  //   document.body.style.cursor = "default";
  // };

  return (
    <div className="ag-theme-material x">
      <AgGridReact
        enableRtl={true}
        onGridReady={params => {
          params.api.sizeColumnsToFit();
          // setGridApi(params.api);
        }}
        columnDefs={[
          {
            headerName: "נושא",
            field: "title",
            resizable: true
          },
          {
            headerName: "משימה",
            field: "description",
            resizable: true
          },
          {
            headerName: "אחריות",
            field: "assign",
            resizable: true
          },
          {
            headerName: "תאריך יעד",
            field: "due",
            resizable: true
          }
        ]}
        rowData={tasks}
        onRowClicked={onRowClicked}
        // cellMouseOver={cellMouseOver}
        // cellMouseOut={cellMouseOut}
      />
    </div>
  );
}

export default Tasks;
