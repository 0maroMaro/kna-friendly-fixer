@echo off
echo Building the application...
call npm run build
echo.
echo Starting server...
echo Your app will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npx serve dist
