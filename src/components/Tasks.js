import React from "react";
import "./Tasks.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function Tasks() {
  return (
    <div className="ag-theme-material x">
      <AgGridReact
        enableRtl={true}
        columnDefs={[
          {
            headerName: "נושא",
            field: "subject"
          },
          {
            headerName: "משימה",
            field: "task"
          },
          {
            headerName: "אחריות",
            field: "assgine"
          },
          {
            headerName: "תאריך יעד",
            field: "dueDate"
          }
        ]}
        rowData={[
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          },
          {
            subject: "Toyota",
            task: "Celica",
            assgine: 35000,
            dueDate: "hjkhj"
          }
        ]}
      />
    </div>
  );
}

export default Tasks;
