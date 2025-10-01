import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ThemeProvider } from './contexts/ThemeContext';
import { EvaluationProvider } from './contexts/EvaluationContext';

function App() {
  return (
    <ThemeProvider>
      <EvaluationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Keep the old route for backward compatibility */}
              <Route path="/evaluate" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </EvaluationProvider>
    </ThemeProvider>
  );
}

export default App;
