
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Download from "./pages/Download";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import FilesManager from "./pages/admin/FilesManager";

// Components
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";

// Providers
import { AuthProvider } from "./hooks/useAuth";
import { FileStorageProvider } from "./hooks/useFileStorage";
import { ProjectDataProvider } from "./hooks/useProjectData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <FileStorageProvider>
            <ProjectDataProvider>
              <Toaster />
              <Sonner />
              
              <Routes>
                {/* Public routes */}
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <Layout>
                      <Projects />
                    </Layout>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <Layout>
                      <Skills />
                    </Layout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Layout>
                      <Contact />
                    </Layout>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/download/:id" element={<Download />} />
                
                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/admin/files"
                  element={
                    <AdminLayout>
                      <FilesManager />
                    </AdminLayout>
                  }
                />
                
                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProjectDataProvider>
          </FileStorageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
