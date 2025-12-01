import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// We inject Tailwind CSS via JS here so you don't have to set up a complex PostCSS build pipeline.
const style = document.createElement('style');
style.textContent = `
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  body { margin: 0; font-family: sans-serif; }
  .cursor-wait { cursor: wait; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
