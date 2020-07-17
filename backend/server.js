var express = require('express');
var app = express();
const path = require('path');

const port = process.env.PORT || 8888;
const redirect_link = process.env.REDIRECT_URI || 'http://localhost:8888/callback';
app.use(express.static(path.resolve(__dirname, '../dist/covidtracker')));
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../dist/covidtracker', 'index.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});