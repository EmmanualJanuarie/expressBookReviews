const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // Access the secret from environment variables

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.sendStatus(401); // No token present

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Attach user info to request
        next();
    });
};


// Authentication middleware for routes under /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    const accessToken = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized - Token given is invalid" }); // Token is invalid
            }
            req.user = decoded; // Save user info to request object
            next(); // User is authenticated
        });
    } else {
        return res.status(401).json({ message: "Unauthorized - No token Provided" }); // No token provided
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
