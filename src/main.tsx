import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "@/backend/auto/consoleOverrider.ts";

import App from "./App.tsx";
import Index from "@/routes/index.tsx";
import NotFound from "@/routes/error/NotFound.tsx";
import LoginPage from "@/routes/auth/login.tsx";
import RegisterPage from "@/routes/auth/register.tsx";
import Movies from '@/routes/movies.tsx'
import ShowtimeSelection from '@/routes/reservation/showtime-selection.tsx'
import SeatSelection from '@/routes/reservation/seat-selection.tsx'
import CheckoutSimulation from '@/routes/reservation/simulated-checkout.tsx'
import DataConfirmation from '@/routes/reservation/confirmation.tsx'
import UserPanel from '@/routes/user/page.tsx'
import AdminPanel from '@/routes/admin/page.tsx'

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Index />} />
            <Route path="movies" element={<Movies />} />
            <Route path="reserve/showtime" element={<ShowtimeSelection />} />
            <Route path="reserve/seat" element={<SeatSelection />} />
            <Route path="reserve/checkout" element={<CheckoutSimulation />} />
            <Route path="reserve/confirmation" element={<DataConfirmation />} />
            <Route path="portal/dashboard" element={<UserPanel />} />
            <Route path="portal/_admin/dashboard" element={<AdminPanel />} />
            <Route path="portal/_login" element={<LoginPage />} />
            <Route path="portal/_register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
