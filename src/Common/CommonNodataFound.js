import React from "react";
import NodataImage from "../images/svgviewer-png-output.png";
import "./commonstyles.css";

export default function CommonNodataFound({ title, style }) {
  return (
    <div className="common_nodataContainer" style={style}>
      <img src={NodataImage} className="common_nodataimage" />
      <p>{title}</p>
    </div>
  );
}
