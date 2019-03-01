import React from "react";
import { withI18n } from "react-i18next";
import AppNavbar from "../../../components/AppNavbar";
import lifemap_begin_image from "../../../assets/lifemap_begin_image.png";

const BeginLifemap = ({ t, data, parentNextStep, parentPreviousStep }) => (
  <div>
    <AppNavbar
      text="Your Life Map"
      showBack
      backHandler={parentPreviousStep}
    />
    <div className="text-center" style={{ padding: "100px 20px" }}>
      <h2 style={{ paddingBottom: "50px" }}>
        {t("views.lifemap.thisLifeMapHas").replace("%n", data)}
      </h2>
      <img src={lifemap_begin_image} alt="lifemap_begin_image" />
    </div>
    <div style={{ paddingTop: 20 }}>
      <button
        type="submit"
        className="btn btn-primary btn-block"
        onClick={parentNextStep}
      >
        Continue
      </button>
    </div>
  </div>
);

export default withI18n()(BeginLifemap);
