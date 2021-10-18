import express, { Request, Response, Router as RouterInterface } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import xmlParser from 'express-xml-bodyparser'
import setupSwaggerUI from './apiDocumentation';
const app = express();

// Enables CORS
app.use(cors({ origin: true }));

setupSwaggerUI(app);

// Configure the Entity routes
const routes = express.Router()

const basename = path.basename(module.filename);

//Parses the body of POST/PUT request XML
app.use(xmlParser());

// Parses the body of POST/PUT request
// to JSON
app.use(
    bodyParser.json({
        verify: function (req, res, buf) {
            (<any>req).originalUrl;
            // (<any>req).rawBody = buf.toString();
        },
    }),
);


let tes = fs.readdirSync(__dirname)
    .filter(function (file) {
        return (
            file.indexOf('.') === -1 &&
            file !== basename &&
            (file.slice(-3) !== '.js' ||
                file.slice(-3) !== '.ts')
        );
    })
    .forEach(function (file) {
        require(`./${file}`).default(routes);
        // console.log(file)
    });




// Add the routes to the /api endpoint
app.use('/api', routes);

export default app;
