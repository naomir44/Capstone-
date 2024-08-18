import SideBar from "../SideBar";
import "./Navigation.css";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { useSelector } from "react-redux";

function Navigation() {
  const user = useSelector(state => state.session.user);

  return (
    <div className="navigation-container">
      {user && <SideBar />}
      <ul className="navigation-button-list">
        {!user && (
          <li className="navigation-button-item">
            <OpenModalMenuItem
              itemText="Log In"
              modalComponent={<LoginFormModal />}
              className="navigation-button-login"
            />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
