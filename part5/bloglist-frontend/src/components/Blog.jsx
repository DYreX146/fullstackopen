import { useState } from "react";
import { useMatch, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetNotification } from "../providers/NotificationContext";
import { useUserValue } from "../providers/UserContext";
import blogService from "../services/blogs";

const Blog = () => {
  const [comment, setComment] = useState("");

  const match = useMatch("/blogs/:id");
  const queryClient = useQueryClient();
  const user = useUserValue();
  const setNotification = useSetNotification();
  const navigate = useNavigate();

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      const currentBlog = blogs.find((blog) => blog.id === newBlog.id);
      newBlog.user = currentBlog.user;
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === newBlog.id ? newBlog : b)),
      );
      setNotification({
        message: `You liked ${newBlog.title} by ${newBlog.author}`,
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

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (id) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== id),
      );
      setNotification({
        message: "Deleted blog",
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

  const addCommentMutation = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      const currentBlog = blogs.find((blog) => blog.id === newBlog.id);
      newBlog.user = currentBlog.user;
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === newBlog.id ? newBlog : b)),
      );
      setNotification({
        message: `Added comment '${newBlog.comments[newBlog.comments.length - 1]}'`,
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

  const handleLike = (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    updateBlogMutation.mutate(newBlog);
  };

  const handleBlogDelete = (blogToDelete) => {
    if (
      confirm(
        `Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}?`,
      )
    ) {
      deleteBlogMutation.mutate(blogToDelete.id);
      navigate("/");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addCommentMutation.mutate({ blogId: blog.id, comment });
    setComment("");
  };

  const blogQuery = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  if (blogQuery.isLoading) {
    return <div>Loading data...</div>;
  }

  if (blogQuery.isError) {
    return <div>Blog service unavailable</div>;
  }

  const blogs = blogQuery.data;
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  return (
    <div className="container text-center">
      <h1 className="py-3">{blog.title}</h1>
      <div className="mb-3">
        <Link to={blog.url}>{blog.url}</Link>
      </div>
      <div className="mb-3">
        <button
          className="btn btn-primary mx-2"
          onClick={() => handleLike(blog)}
        >
          Like
        </button>
        {blog.likes}
      </div>
      <div className="mb-3">Added by {blog.user.name}</div>

      {blog.user.username === user.username && (
        <div>
          <button
            className="btn btn-danger"
            onClick={() => handleBlogDelete(blog)}
          >
            Delete
          </button>
        </div>
      )}

      <h3 className="mt-5 mb-4">Comments</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-primary mt-3" type="submit">
          Add Comment
        </button>
      </form>

      <ul className="list-group list-group-flush py-5">
        {blog.comments.map((comment) => (
          <li key={comment} className="list-group-item">
            {comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
