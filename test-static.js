const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Static File Test</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <h1>Static File Test</h1>
            <p>If you see styling, CSS is working!</p>
            <div class="btn btn-primary">Test Button</div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
    console.log(`Check if CSS loads: http://localhost:${port}/css/style.css`);
});
