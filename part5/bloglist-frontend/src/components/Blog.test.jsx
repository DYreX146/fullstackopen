import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("initially only displays blog title and author", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "test",
    url: "test.com",
    likes: 55,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText(
    "Component testing is done with react-testing-library test",
  );
  expect(element).toBeDefined();

  const urlQuery = screen.queryByText("test.com");
  expect(urlQuery).toBeNull();

  const likeQuery = screen.queryByText("likes");
  expect(likeQuery).toBeNull();
});

test("displays blog url and likes after view button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "test",
    url: "test.com",
    likes: 55,
    user: {
      name: "admin",
      username: "admin",
    },
  };

  const authedUser = {
    username: "admin",
  };

  render(<Blog blog={blog} user={authedUser} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const element = screen.getByText(
    "Component testing is done with react-testing-library test",
  );
  expect(element).toBeDefined();

  const urlQuery = screen.queryByText("test.com");
  expect(urlQuery).toBeDefined();

  const likeQuery = screen.queryByText("likes");
  expect(likeQuery).toBeDefined();
});

test("like button event handler is called twice after 2 clicks", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "test",
    url: "test.com",
    likes: 55,
    user: {
      name: "admin",
      username: "admin",
    },
  };

  const authedUser = {
    username: "admin",
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} user={authedUser} updateBlog={mockHandler} />);

  const user = userEvent.setup();
  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
