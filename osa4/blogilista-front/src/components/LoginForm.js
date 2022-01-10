import React from 'react'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          Username:
          <input
          id="username"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password:
          <input
          id="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button id="login-button" type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm