"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const auth_service_1 = require("./auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_validator_1 = require("../validation/user.validator");
const googlemailer_1 = require("../middleware/googlemailer");
const createUser = async (req, res) => {
    try {
        // Validate user input
        const parseResult = user_validator_1.UserValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }
        const user = parseResult.data;
        const userEmail = user.email;
        const existingUser = await (0, auth_service_1.getUserByEmailService)(userEmail);
        if (existingUser) {
            res.status(400).json({ error: "User with this email already exists" });
            return;
        }
        // Genereate hashed password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedPassword = bcrypt_1.default.hashSync(user.password, salt);
        user.password = hashedPassword;
        // Call the service to create the user
        const newUser = await (0, auth_service_1.createUserServices)(user);
        let emailResult;
        try {
            emailResult = await (0, googlemailer_1.sendNotificationEmail)(user.email, user.firstname, user.lastname, "Account Created Successfully 🌟", `Welcome to RideXpress, ${user.firstname}! Your account has been created successfully.`);
        }
        catch (emailErr) {
            console.warn("User created, but failed to send welcome email:", emailErr);
            emailResult = "Failed to send welcome email";
        }
        res.status(201).json({ message: newUser, emailNotification: emailResult });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to create user" });
    }
};
exports.createUser = createUser;
//Login User
const loginUser = async (req, res) => {
    try {
        const parseResult = user_validator_1.UserLoginValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }
        const { email, password } = parseResult.data;
        // Check if user exists
        const user = await (0, auth_service_1.getUserByEmailService)(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Compare passwords
        const isMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        // Generate token
        let payload = {
            userId: user.userId,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            contact: user.contact,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };
        let secret = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign(payload, secret);
        console.log(payload);
        res.status(200).json({
            token,
            user: {
                id: user.userId,
                email: user.email,
                role: user.role,
            },
            role: user.role,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: error.message || "Failed to login user" });
    }
};
exports.loginUser = loginUser;
