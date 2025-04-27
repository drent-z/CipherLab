# CipherLab Installation Guide

This guide provides multiple ways to run CipherLab locally, depending on your preferences and technical setup.

## Quick Start Options

Choose one of the following methods:

### Method 1: Using Setup Scripts (Easiest)

**For Windows users:**
1. Double-click `setup.bat`
2. Follow the on-screen instructions

**For Mac/Linux users:**
1. Open a terminal in the project folder
2. Run `./setup.sh`
3. Follow the on-screen instructions

### Method 2: Manual Setup

1. Install [Node.js](https://nodejs.org/) (version 14 or higher)
2. Open a terminal/command prompt in the project folder
3. Run `npm install`
4. Run `npm start`
5. Open your browser to http://localhost:8080

### Method 3: Using Docker (For Docker Users)

If you have Docker and Docker Compose installed:

```bash
docker-compose up
```

Then open your browser to http://localhost:8080

## Detailed Instructions

### Prerequisites

- **Node.js**: Version 14 or higher is required
- **npm**: Comes with Node.js installation
- **Docker** (optional): Only needed if you want to use the Docker method

### Running in Development Mode

While running with `npm start`, the site will automatically reload when you make changes to the source files.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `_site` folder containing all the static files that can be deployed to any web server.

### Project Structure

- `templates/`: Nunjucks templates
- `assets/`: Static assets (CSS, JS, images)
- `_site/`: Generated output (created after building)

## Troubleshooting

### Common Issues

1. **"node" is not recognized as an internal command**
   - Make sure Node.js is installed properly
   - Restart your terminal/command prompt after installation

2. **Error: Cannot find module '@11ty/eleventy'**
   - Run `npm install` again to ensure all dependencies are installed

3. **Port 8080 already in use**
   - Change the port in `.eleventy.js` to another value (e.g., 8081)
   - Restart the server

For additional help, please refer to the [Eleventy documentation](https://www.11ty.dev/docs/) or open an issue on GitHub.
