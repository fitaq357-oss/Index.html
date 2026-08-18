import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Calendar from "@/pages/Calendar";
import Home from "@/pages/Home";
import IdeaBank from "@/pages/IdeaBank";
import Research from "@/pages/Research";
import Strategy from "@/pages/Strategy";
import Studio from "@/pages/Studio";
import { Route, Switch } from "wouter";
import DashboardLayout from "./components/DashboardLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/strategy" component={Strategy} /><Route path="/research" component={Research} /><Route path="/calendar" component={Calendar} /><Route path="/studio" component={Studio} /><Route path="/ideas" component={IdeaBank} /><Route component={Home} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><DashboardLayout><Router /></DashboardLayout><Toaster /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
