import React, { SFC, useState } from "react";
import userService from "../services/user.service";

export interface Props {}

const ForgotPassword: SFC<Props> = () => {
  const [email, setEmail] = useState("");
  const [isSubmit, setSubmit] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const handleChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setSubmit(true);

    userService
      .sendResetPasswordEmail(email)
      .then(response => {
        console.log(response);
        setSubmit(false);
        setEmail("");
        setSuccess("An email has been sent to your email address.");
          setError(null);
          setTimeout(() => {
            setSuccess(null);
        }, 7000);
      })
      .catch(err => {
        console.error(err);
        setError("Invalid email address.");
        setSuccess(null);
          setTimeout(() => {
              setError(null);
          }, 7000);
        setSubmit(false);
      });
  };

  return (
    <div className="forgotPasswordPage">
      <h1>Forgot password ?</h1>
      <p>
          In order to reset your password, please enter the email address linked to your account in the field below, an email containing a link to change your password will be sent to you.
      </p>
      {success && <div className="alert-success">{success}</div>}
      {error && <div className="alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form__input"
            placeholder="Email address"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className={`btn btn--center btn--small btn--square ${
            isSubmit ? "btn--disabled" : ""
          }`}
        >
          {(!isSubmit && (
            <>
              <svg>
                <use xlinkHref="../img/sprite.svg#icon-envelope" />
              </svg>
              Submit
            </>
          )) || <>Loading...</>}
        </button>
      </form>
      <hr />
      <div className="alert-info">
        If you do not remember your email address, please
        contact an administrator.
      </div>
    </div>
  );
};

export default ForgotPassword;
