import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateEvent from "./pages/CreateEvent";
import CreateEventDates from "./pages/CreateEventDates";
import EventCreated from "./pages/EventCreated";
import Dashboard from "./pages/Dashboard";
import EventPlan from "./pages/EventPlan";
import EventDetails from "./pages/EventDetails";
import Invite from "./pages/Invite";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/create/dates" element={<CreateEventDates />} />
          <Route path="/event-created" element={<EventCreated />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event/:id/plan" element={<EventPlan />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/invite/:id" element={<Invite />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
