import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import userService from "../services/users";

const Users = () => {
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

  return (
    <div className="container text-center">
      <h1 className="display-2 py-5">Users</h1>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
