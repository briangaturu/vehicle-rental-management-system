"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bothRolesAuth = exports.userRoleAuth = exports.adminRoleAuth = exports.authMiddleware = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//AUTHENTICATION MIDDLEWARE
const verifyToken = async (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
//AUTHORIZATION MIDDLEWARE
const authMiddleware = async (req, res, next, requiredRole) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ error: "Authorization header is missing" });
        return;
    }
    const decodedToken = await (0, exports.verifyToken)(token, process.env.JWT_SECRET);
    if (!decodedToken) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
    const role = decodedToken?.role;
    // console.log("🚀 ~ authMiddleware ~ decodedToken:", decodedToken)
    if (requiredRole === "both" && (role === "admin" || role === "user")) {
        if (decodedToken.role === "admin" || decodedToken.role === "user") {
            req.user = decodedToken;
            next();
            return;
        }
    }
    else if (role === requiredRole) {
        req.user = decodedToken;
        next();
        return;
    }
    else {
        res.status(403).json({ error: "Forbidden: You do not have permission to access this resource" });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware to check if the user is an admin
const adminRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "admin");
exports.adminRoleAuth = adminRoleAuth;
const userRoleAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "user");
exports.userRoleAuth = userRoleAuth;
const bothRolesAuth = async (req, res, next) => await (0, exports.authMiddleware)(req, res, next, "both");
exports.bothRolesAuth = bothRolesAuth;
