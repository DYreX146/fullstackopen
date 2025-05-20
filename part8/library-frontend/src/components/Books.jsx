import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("");
  const [uniqueGenres, setUniqueGenres] = useState([]);

  const allBooksResult = useQuery(ALL_BOOKS);
  const booksByGenreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: genreFilter },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (allBooksResult.data) {
      setUniqueGenres([
        ...new Set(
          allBooksResult.data.allBooks.reduce(
            (genres, book) => genres.concat(book.genres),
            []
          )
        ),
      ]);
    }
  }, [allBooksResult.data]);

  if (!props.show) {
    return null;
  }

  if (allBooksResult.loading || booksByGenreResult.loading) {
    return <div>loading...</div>;
  }

  if (allBooksResult.error || booksByGenreResult.error) {
    return <div>failed to load books</div>;
  }

  const books = booksByGenreResult.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((genre) => (
        <button key={genre} onClick={() => setGenreFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenreFilter("")}>all genres</button>
    </div>
  );
};

export default Books;
