import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy load routes to reduce initial bundle size
const IndexPage = lazy(() => import("@/pages/index"));
const ContactForm = lazy(() => import("@/pages/contact"));
const AboutPage = lazy(() => import("@/pages/about"));
const ProjectsPage = lazy(() => import("@/pages/projects"));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<ContactForm />} path="/contact" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<ProjectsPage />} path="/projects" />
      </Routes>
    </Suspense>
  );
}

export default App;
