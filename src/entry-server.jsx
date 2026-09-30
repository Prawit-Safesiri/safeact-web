import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
export { ROUTES, headTags } from './seo.js';
export { llmsTxt } from './llms.js';
export { LAWS, CATEGORIES, coverSrc } from './data/laws.js';
export { LAW_MOTION, motionCategory } from './data/law-update-motion.js';
export { SITE_URL, APP_URL } from './data/company.js';
export { PLANS, baht } from './data/plans.js';

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
