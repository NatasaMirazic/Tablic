import React from "react";

function Result(props) {
  return (
    <div>
      <h3 className="human-points">Points: {props.humanPoints} </h3>
      <h3 className="human-table">Tables: {props.humanTables}</h3>
      <hr className="human-hr"></hr>
      <h1 className="human-sum-points">Sum: {props.humanPoints + props.humanTables} </h1>
      <h3 className="comp-points">Points: {props.computerPoints} </h3>
      <h3 className="comp-table">Tables: {props.computerTables}</h3>
      <hr className="comp-hr"></hr>
      <h1 className="comp-sum-points">Sum: {props.computerPoints + props.computerTables} </h1>
    </div>
  )
}

export default Result;
