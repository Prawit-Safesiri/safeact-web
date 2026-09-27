import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import RefundPolicy from './pages/RefundPolicy.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="features" caseSensitive element={<Features />} />
        <Route path="pricing" caseSensitive element={<Pricing />} />
        <Route path="refund-policy" caseSensitive element={<RefundPolicy />} />
        <Route path="terms" caseSensitive element={<Terms />} />
        <Route path="privacy" caseSensitive element={<Privacy />} />
        <Route path="about" caseSensitive element={<About />} />
        <Route path="contact" caseSensitive element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
