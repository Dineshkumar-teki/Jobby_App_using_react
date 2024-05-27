import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', displayErrorMsg: false, errorMsg: ''}

  formSubmit = async event => {
    const {username, password} = this.state
    event.preventDefault()
    const userDetails = {
      username,
      password,
    }
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok) {
      const fomattedData = {
        jwtToken: data.jwt_token,
      }
      const {jwtToken} = fomattedData
      Cookies.set('jwt_token', jwtToken, {expires: 10})
      const {history} = this.props
      this.setState({
        username: '',
        password: '',
        errorMsg: '',
        displayErrorMsg: false,
      })
      history.replace('/')
    } else if (response.status === 400) {
      this.setState({displayErrorMsg: true, errorMsg: data.error_msg})
    }
  }

  getUsername = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, displayErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginBgContainer">
        <div className="loginCard">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="loginForm">
            <label htmlFor="username" className="loginLabel">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={this.getUsername}
              placeholder="Enter Username"
              className="loginInput"
            />
            <label htmlFor="password" className="loginLabel">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={this.getPassword}
              placeholder="Enter Password"
              className="loginInput"
            />
          </form>
          <button className="loginBtn" type="button" onClick={this.formSubmit}>
            Login
          </button>
          {displayErrorMsg ? <p className="errorMsg">*{errorMsg}</p> : ''}
        </div>
      </div>
    )
  }
}

export default LoginRoute
