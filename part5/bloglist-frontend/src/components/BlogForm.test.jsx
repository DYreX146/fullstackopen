import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("blog form event handler receives correct blog object", async () => {
  const mockHandler = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={mockHandler} />);

  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");
  const createButton = screen.getByText("create");

  await user.type(
    titleInput,
    "Component testing is done with react-testing-library",
  );
  await user.type(authorInput, "test");
  await user.type(urlInput, "test.com");
  await user.click(createButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0].title).toBe(
    "Component testing is done with react-testing-library",
  );
  expect(mockHandler.mock.calls[0][0].author).toBe("test");
  expect(mockHandler.mock.calls[0][0].url).toBe("test.com");
});
