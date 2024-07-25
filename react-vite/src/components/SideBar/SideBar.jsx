import Groups from "../Groups/Groups";
import './SideBar.css'
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <>
    <div className='sidebar'>
    <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
      </ul>
      <ul>
        <li>
          <Groups />
        </li>
      </ul>
    </div>
    </>
  )
}
export default SideBar;
