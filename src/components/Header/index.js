import {withRouter, Link} from 'react-router-dom'
import {FaHome} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const userLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="websiteLogo"
        />
      </Link>
      <ul className="navElements">
        <li className="tabName">
          <Link to="/">Home</Link>
        </li>
        <li className="tabName">
          <Link to="/jobs">Jobs</Link>
        </li>
      </ul>
      <button className="logoutBtn" type="button" onClick={userLogout}>
        Logout
      </button>
      <ul className="inMobileTabs">
        <li>
          <Link to="/">
            <FaHome />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <BsFillBriefcaseFill />
          </Link>
        </li>
        <li>
          <button
            className="mobileLogoutBtn"
            type="button"
            onClick={userLogout}
            aria-label="logout"
          >
            <FiLogOut />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
