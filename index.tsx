
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("NovaMarket: Initiating mount with React 18.3.1...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("NovaMarket: Root element not found!");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("NovaMarket: Render successful.");
} catch (error) {
  console.error("NovaMarket: Failed to render app:", error);
}
