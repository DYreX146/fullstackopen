import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./providers/NotificationContext";
import { UserContextProvider } from "./providers/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <Router>
          <App />
        </Router>
      </UserContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>,
);
