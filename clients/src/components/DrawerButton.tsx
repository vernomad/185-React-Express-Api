import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function DrawerButton() {
const { toggleDrawer } = useContext(UserContext)

  return (
    <li>
    {/* Toggle button */}
    <button type="button" className="contact-button-header" onClick={toggleDrawer}>
    Contact
    </button>
  </li>
  )
}
