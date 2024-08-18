import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="login-form-modal-container">
      <h1 className="login-form-modal-heading">Log In</h1>
      <form onSubmit={handleSubmit} className="login-form-modal-form">
        <label className="login-form-modal-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-form-modal-input"
          />
        </label>
        {errors.email && <p className="login-form-modal-error">{errors.email}</p>}
        <label className="login-form-modal-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-form-modal-input"
          />
        </label>
        {errors.password && <p className="login-form-modal-error">{errors.password}</p>}
        <button type="submit" className="login-form-modal-button">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
