import express from "express";
import routes from './routes/index.mjs'
import cors from 'cors';
import consoleStamp from "console-stamp"; // utility to insert timestamps on console logs

consoleStamp(console, 'HH:MM:ss');
// TODO add an healthcheck 

export const dumpLogActive = true; 

const app = express();

// NOTE development only 
const port = 3000; 

const asciiart = `
 ▗▄▄▖▗▄▄▄▖ ▗▄▄▖ ▗▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖    ▗▄▄▖ ▗▄▄▄▖▗▄▄▄▖
▐▌   ▐▌   ▐▌   ▐▌     █  ▐▌ ▐▌▐▛▚▖▐▌    ▐▌ ▐▌▐▌   ▐▌   
 ▝▀▚▖▐▛▀▀▘ ▝▀▚▖ ▝▀▚▖  █  ▐▌ ▐▌▐▌ ▝▜▌    ▐▛▀▚▖▐▛▀▀▘▐▛▀▀▘
▗▄▄▞▘▐▙▄▄▖▗▄▄▞▘▗▄▄▞▘▗▄█▄▖▝▚▄▞▘▐▌  ▐▌    ▐▙▄▞▘▐▙▄▄▖▐▙▄▄▖

`;

// json middleware
app.use(express.json());


// FIXME needs to be fine grained 
app.use(cors()); // TODO i may think about extra auth check for session starting 
app.options('*', cors());

// api prefix
app.use('/api/v1', routes);

app.listen(port, () => {
    console.log(asciiart);
    console.log("Server STARTED");
    console.log("listening...");
});


