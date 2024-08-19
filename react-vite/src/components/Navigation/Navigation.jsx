import SideBar from "../SideBar";
import "./Navigation.css";
import LoginFormModal from "../LoginFormModal";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";

function Navigation() {
  const user = useSelector(state => state.session.user);

  return (
    <div className="navigation-container">
      {user && <SideBar />}
      <div className="navigation-button-list">
        {!user && (
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
              className="navigation-button-login"
            />
        )}
      </div>
    </div>
  );
}

export default Navigation;
