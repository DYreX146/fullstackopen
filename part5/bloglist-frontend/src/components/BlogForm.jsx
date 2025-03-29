import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetNotification } from "../providers/NotificationContext";
import { useUserValue } from "../providers/UserContext";
import blogService from "../services/blogs";
import Toggleable from "../components/Toggleable";

const BlogForm = () => {
  const [newBlog, setNewBlog] = useState(null);

  const queryClient = useQueryClient();
  const user = useUserValue();
  const blogFormRef = useRef();
  const setNotification = useSetNotification();

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      newBlog.user = user;
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      setNotification({
        message: `Added ${newBlog.title} by ${newBlog.author}`,
        isError: false,
      });
    },
    onError: (error) => {
      setNotification({
        message: error.response.data.error,
        isError: true,
      });
    },
  });

  const addBlog = (event) => {
    event.preventDefault();
    blogFormRef.current.toggleVisibility();
    createBlogMutation.mutate(newBlog);
    setNewBlog(null);
  };

  return (
    <Toggleable buttonLabel="Create Blog" ref={blogFormRef}>
      <div>
        <h2 className="mb-4">Create Blog</h2>
        <form onSubmit={addBlog}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              value={newBlog ? (newBlog.title ?? "") : ""}
              name="title"
              onChange={(event) =>
                setNewBlog({ ...newBlog, title: event.target.value })
              }
              placeholder="Title"
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              value={newBlog ? (newBlog.author ?? "") : ""}
              name="author"
              onChange={(event) =>
                setNewBlog({ ...newBlog, author: event.target.value })
              }
              placeholder="Author"
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              value={newBlog ? (newBlog.url ?? "") : ""}
              name="url"
              onChange={(event) =>
                setNewBlog({ ...newBlog, url: event.target.value })
              }
              placeholder="URL"
            />
          </div>
          <button className="btn btn-success" type="submit">
            Create
          </button>
        </form>
      </div>
    </Toggleable>
  );
};

export default BlogForm;
