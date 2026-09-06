import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ServerStatusProvider } from "./context/ServerStatusContext";
import { ServerWakeupBanner } from "./components/common/ServerWakeupBanner";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ServerStatusProvider>
          <ServerWakeupBanner />
          <AppRoutes />
        </ServerStatusProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
