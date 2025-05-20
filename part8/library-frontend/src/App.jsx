import { useState, useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";
import { updateCache } from "./helpers";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      window.alert(`Book '${addedBook.title}' added`);
    },
  });

  useEffect(() => {
    const currentToken = localStorage.getItem("books-user-token");

    if (currentToken) {
      setToken(currentToken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <span>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={logout}>logout</button>
          </span>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} hasToken={Boolean(token)} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm show={page === "login"} setToken={setToken} />

      <Recommended show={page === "recommended"} />
    </div>
  );
};

export default App;
