import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./hooks/use-theme";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";

// Admin pages
import AdminPages from "@/pages/admin/pages";
import AdminContacts from "@/pages/admin/contacts";
import AdminFAQ from "@/pages/admin/faq";
import AdminLinks from "@/pages/admin/links";

// Teleconseiller pages
import TeleconDashboard from "@/pages/teleconseiller/dashboard";
import TeleconContacts from "@/pages/teleconseiller/contacts";
import TeleconFAQ from "@/pages/teleconseiller/faq";
import TeleconLinks from "@/pages/teleconseiller/links";
import TeleconLearning from "@/pages/teleconseiller/learning";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />

      {/* Admin routes */}
      <ProtectedRoute path="/admin/pages" component={AdminPages} />
      <ProtectedRoute path="/admin/contacts" component={AdminContacts} />
      <ProtectedRoute path="/admin/faq" component={AdminFAQ} />
      <ProtectedRoute path="/admin/links" component={AdminLinks} />

      {/* Teleconseiller routes */}
      <ProtectedRoute path="/" component={TeleconDashboard} />
      <ProtectedRoute path="/contacts" component={TeleconContacts} />
      <ProtectedRoute path="/faq" component={TeleconFAQ} />
      <ProtectedRoute path="/links" component={TeleconLinks} />
      <ProtectedRoute path="/learning" component={TeleconLearning} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;