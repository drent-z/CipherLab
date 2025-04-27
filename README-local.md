# Running CipherLab Locally

This guide provides instructions for setting up and running CipherLab locally on your computer.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- npm (comes with Node.js)

## Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/your-username/CipherLab.git
   cd CipherLab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Development Server

1. Start the local development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

The development server will automatically reload whenever you make changes to the source files.

## Building for Production

To build the site for production:

```bash
npm run build
```

This will generate the static site in the `_site` directory, which you can then deploy to any static hosting service.

## Project Structure

- `templates/`: Contains all the Nunjucks (.njk) templates for the site
- `assets/`: Contains all static assets (CSS, JavaScript, images, etc.)
- `.eleventy.js`: Eleventy configuration file

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js and npm are properly installed
2. Try deleting the `node_modules` directory and running `npm install` again
3. Check the console for any error messages

For further assistance, please open an issue on GitHub.
