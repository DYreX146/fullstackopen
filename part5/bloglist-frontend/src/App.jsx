import { useState, useEffect, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import UserList from "./components/UserList";
import User from "./components/User";
import Blog from "./components/Blog";

import { useSetNotification } from "./providers/NotificationContext";
import UserContext from "./providers/UserContext";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, userDispatch] = useContext(UserContext);
  const setNotification = useSetNotification();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("userLogin");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET", payload: user });
      blogService.setToken(user.token);
    }
  }, [userDispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("userLogin", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: "SET", payload: user });
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotification({
        message: "Wrong username or password",
        isError: true,
      });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("userLogin");
    userDispatch({ type: "REMOVE" });
  };

  return (
    <div className="container py-5">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            Blog List
          </Link>
          {user && (
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Blogs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/users" className="nav-link">
                    Users
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item mx-2">{user.name}</li>
                <li className="nav-item mx-2">
                  <Link to="/" className="link-danger" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <Notification />

      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <Routes>
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/" element={<BlogList />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
