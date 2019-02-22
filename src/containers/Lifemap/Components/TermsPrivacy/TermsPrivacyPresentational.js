import React from "react";
import { Link, withRouter } from "react-router-dom";
import { withI18n } from "react-i18next";
import Checkbox from "../../../../assets/Checkbox.png";
import AppNavbar from "../../../../components/AppNavbar";
const TermsPrivacyPresentational = ({
  data,
  header,
  step,
  nextStep,
  previousStep,
  t,
  location
}) => {
  return (
    <div>
      <AppNavbar
        text={header}
        showBack={true}
        draftOngoing={false}
        backHandler={() => previousStep()}
      />
      <div className="text-center">
        <img src={Checkbox} alt="chekbox" />
      </div>
      <div>
        <div className="text-center">
          <h3>{data.title}</h3>
          <hr className="my-4" />
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: data.text.split("\\n").join("<br/>")
          }}
        />
        <p className="lead text-center">
          <Link to="/surveys">
            <button className="btn btn-lg col-4" href="#">
              {t("general.disagree")}
            </button>
          </Link>
          {step === 0 ? (
            <button
              className="btn btn-primary btn-lg col-4"
              href="#"
              onClick={() => nextStep()}
            >
              {t("general.agree")}
            </button>
          ) : (
            <Link
              to={{
                pathname: `/lifemap/${location.state.surveyId}/1`,
                state: {
                  surveyId: location.state.surveyId
                }
              }}
            >
              <button
                className="btn btn-primary btn-lg col-4"
                href="#"
                onClick={() => nextStep()}
              >
                {t("general.agree")}
              </button>
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default withRouter(withI18n()(TermsPrivacyPresentational));
