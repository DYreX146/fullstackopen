export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (books) => {
    let seen = new Set();
    return books.filter((book) =>
      seen.has(book.title) ? false : seen.add(book.title)
    );
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    };
  });
};
