# React + Vite CRM Dashboard UI

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. This project has been expanded into a CRM Dashboard UI.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Project Overview

This application serves as the frontend for a CRM dashboard. It allows users to manage customers, leads, tasks, and notes, and view data visualizations on a central dashboard.

## Key Features & Libraries

This project utilizes several key libraries to achieve its functionality:

*   **React:** For building the user interface.
*   **Vite:** As the build tool and development server.
*   **Tailwind CSS:** For utility-first CSS styling.
*   **React Router DOM:** For client-side routing and navigation.
*   **Axios:** For making HTTP requests to the backend API.
*   **Chart.js & react-chartjs-2:** For data visualization on the dashboard.

### Data Visualization

This dashboard utilizes [Chart.js](https://www.chartjs.org/) with the [react-chartjs-2](https://react-chartjs-2.js.org/) wrapper to display visual representations of key indicators on the main dashboard page. Key dependencies for this feature include:

*   `chart.js`
*   `react-chartjs-2`

These are included in the `package.json` and installed via `npm install` within the `dashboard-ui` directory.

## Development

To run the frontend development server:

1.  Navigate to the `dashboard-ui` directory.
2.  Install dependencies: `npm install`
3.  Start the server: `npm run dev`

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
