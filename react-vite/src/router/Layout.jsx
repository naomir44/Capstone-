import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import SideBar from "../components/SideBar";
import "../index.css";

export default function Layout() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <>
    <div className="app-layout">
      <ModalProvider>
        {user &&
        <>
        <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <button className={`sidebar-toggle ${sidebarOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
        </>
        }
        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Navigation />
          {isLoaded && <Outlet />}
        </div>
        <Modal />
      </ModalProvider>
    </div>
    </>
  );
}
