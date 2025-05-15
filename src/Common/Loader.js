import React from "react";
import loader from "../LottieLoader/loaderanimation.json";
import LottieLoader from "react-lottie-loader";
import "./commonstyles.css";

export default function Loader() {
  return (
    <div className="lottieloader_container">
      <LottieLoader animationData={loader} className="lottie_loader" />
    </div>
  );
}
