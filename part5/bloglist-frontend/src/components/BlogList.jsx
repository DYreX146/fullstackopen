import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import blogService from "../services/blogs";
import BlogForm from "./BlogForm";

const BlogList = () => {
  const queryClient = useQueryClient();

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

  return (
    <div className="container text-center">
      <h1 className="display-2 py-5">Blogs</h1>
      <BlogForm />
      <ul className="list-group list-group-flush py-5">
        {blogs
          .toSorted((blog1, blog2) => blog2.likes - blog1.likes)
          .map((blog) => (
            <li key={blog.id} className="list-group-item">
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BlogList;
