import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    // const profilePicToUpload = profilePicture.trim()
    //   ? profilePicture.trim()
    //   : '../../../public/Default_pfp.jpg';

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        name,
        password,
        profile_picture: profilePicture
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-form-modal-container">
      <button className="close-signup-modal" onClick={() => closeModal()}>&times;</button>
      <h1 className="signup-form-modal-heading">Sign Up</h1>
      {errors.server && <p className="signup-form-modal-error">{errors.server}</p>}
      <form onSubmit={handleSubmit} className="signup-form-modal-form">
        <label className="signup-form-modal-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-form-modal-input"
          />
        </label>
        {errors.email && <p className="signup-form-modal-error">{errors.email}</p>}
        <label className="signup-form-modal-label">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-form-modal-input"
          />
        </label>
        {errors.name && <p className="signup-form-modal-error">{errors.name}</p>}
        <label className="signup-form-modal-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-form-modal-input"
          />
        </label>
        {errors.password && <p className="signup-form-modal-error">{errors.password}</p>}
        <label className="signup-form-modal-label">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-form-modal-input"
          />
        </label>
        {errors.confirmPassword && <p className="signup-form-modal-error">{errors.confirmPassword}</p>}
        <label className="signup-form-modal-label">
          Profile Picture
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="signup-form-modal-input"
          />
        </label>
        <button type="submit" className="signup-form-modal-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
