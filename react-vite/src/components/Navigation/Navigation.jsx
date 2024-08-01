import SideBar from "../SideBar";
import "./Navigation.css";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { thunkLogout } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    navigate('/')
  };

  return (
    <div>
      {user && <SideBar />}
      <ul>
        <li>
        {!user ? (
        <>
              <OpenModalMenuItem
                itemText="Log In"
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </>
            ):  <li>
            <button onClick={logout}>Log Out</button>
          </li>}
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
