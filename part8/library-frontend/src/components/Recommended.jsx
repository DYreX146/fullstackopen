import { useQuery } from "@apollo/client";
import { FAVORITE_GENRE, ALL_BOOKS } from "../queries";

const Recommended = (props) => {
  const bookResult = useQuery(ALL_BOOKS);
  const genreResult = useQuery(FAVORITE_GENRE);

  if (!props.show) {
    return null;
  }

  if (bookResult.loading || genreResult.loading) {
    return <div>loading...</div>;
  }

  if (bookResult.error || genreResult.error) {
    return <div>failed to load recommended books</div>;
  }

  const books = bookResult.data.allBooks.filter((book) =>
    book.genres.includes(genreResult.data.me.favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre{" "}
        <strong>{genreResult.data.me.favoriteGenre}</strong>
      </p>

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
    </div>
  );
};

export default Recommended;
