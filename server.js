const http = require("http");
const fs = require("fs");
const path = require("path");

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        // Serve index.html when the root URL is visited
        if (req.url === "/") {
            fs.readFile(path.join(__dirname, "index.html"), "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error loading HTML file");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        }

        // Serve info.html for the '/info' URL
        else if (req.url === "/info") {
            fs.readFile(path.join(__dirname, "info.html"), "utf-8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error loading HTML file");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        }

        // Serve employees data for the '/employees' API
        else if (req.url === "/employees") {
            fs.readFile("employees.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Error reading employee data");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        }

        // Serve static files like CSS, JS, or other resources
        else {
            const filePath = path.join(__dirname, req.url);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("Resource not found");
                } else {
                    const ext = path.extname(filePath);
                    const mimeType = {
                        ".css": "text/css",
                        ".js": "application/javascript",
                        ".json": "application/json",
                        ".png": "image/png",
                        ".jpg": "image/jpeg",
                    };
                    res.writeHead(200, { "Content-Type": mimeType[ext] || "text/plain" });
                    res.end(data);
                }
            });
        }
    }

    // Handle POST request for /submit to add employee data
    else if (req.method === "POST" && req.url === "/submit") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const newEmployee = JSON.parse(body);  // Parse incoming JSON body
                fs.readFile("employees.json", "utf8", (err, data) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Error reading file");
                    } else {
                        const employees = JSON.parse(data || "[]");
                        employees.push(newEmployee);
                        fs.writeFile("employees.json", JSON.stringify(employees, null, 2), (err) => {
                            if (err) {
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("Error writing file");
                            } else {
                                res.writeHead(200, { "Content-Type": "text/plain" });
                                res.end("Employee added successfully");
                            }
                        });
                    }
                });
            } catch (err) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid JSON format");
            }
        });
    }

    // Handle other routes
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
