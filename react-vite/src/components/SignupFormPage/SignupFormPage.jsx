import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import './SignupForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        name,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="signup-form-body">
      <div className="signup-form-container">
        <h1 className="signup-form-heading">Sign Up</h1>
        {errors.server && <p className="signup-form-error">{errors.server}</p>}
        <form onSubmit={handleSubmit}>
          <label className="signup-form-label">
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-form-input"
            />
          </label>
          {errors.email && <p className="signup-form-error">{errors.email}</p>}
          <label className="signup-form-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-form-input"
            />
          </label>
          {errors.name && <p className="signup-form-error">{errors.name}</p>}
          <label className="signup-form-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-form-input"
            />
          </label>
          {errors.password && <p className="signup-form-error">{errors.password}</p>}
          <label className="signup-form-label">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-form-input"
            />
          </label>
          {errors.confirmPassword && <p className="signup-form-error">{errors.confirmPassword}</p>}
          <button type="submit" className="signup-form-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
