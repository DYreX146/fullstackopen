import { useMatch } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../services/users";

const User = () => {
  const match = useMatch("/users/:id");
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (userQuery.isLoading) {
    return <div>Loading data...</div>;
  }

  if (userQuery.isError) {
    return <div>User service unavailable</div>;
  }

  const users = userQuery.data;
  const user = match ? users.find((user) => user.id === match.params.id) : null;

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container text-center">
      <h1 className="py-3">{user.name}</h1>

      <h3 className="mt-4">Added Blogs</h3>

      <ul className="list-group list-group-flush py-5">
        {user.blogs.map((blog) => (
          <li key={blog.id} className="list-group-item">
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
