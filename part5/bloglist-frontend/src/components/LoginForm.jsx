import PropTypes from "prop-types";

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => (
  <div className="container text-center">
    <h1 className="display-2 py-5">Log In</h1>
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <input
          className="form-control"
          data-testid="username"
          placeholder="Username"
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          data-testid="password"
          placeholder="Password"
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button className="btn btn-success" type="submit">
        Login
      </button>
    </form>
  </div>
);

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
