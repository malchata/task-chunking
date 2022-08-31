/* eslint-env node */
/* eslint no-console: "off" */

import { join } from "path";
import express from "express";
const app = express();
const htdocs = join(process.cwd(), "htdocs");

// Run static server
app.use(express.static(htdocs));
app.listen(8080);

console.log("Task chunking demo up and running at http://localhost:8080/");
console.log("Press Ctrl+C to quit.");
