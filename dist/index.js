"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const db_1 = require("./config/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const logEvents_1 = __importDefault(require("./middleware/logEvents"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const credentials_1 = __importDefault(require("./middleware/credentials"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const port = process.env.PORT || 3500;
// custom middleware logger
app.use(logEvents_1.default.logger);
// Handle options credentials check - before CORS! and fetch cookies credentials requirement
app.use(credentials_1.default);
// Cross Origin Resource Sharing
app.use((0, cors_1.default)(corsOptions_1.default)); // Use your CORS configuration here
// built-in middleware to handle urlencoded form data
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: false }));
// middleware for cookies
app.use((0, cookie_parser_1.default)());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../clients/dist')));
// Routes
app.use('/api/user/', authMiddleware_1.default, userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Handle preflight (OPTIONS) requests
app.options('*', (req, res) => {
    res.sendStatus(200); // Preflight response status
});
// Serve fallback page for other routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../clients/dist', 'index.html'));
});
// Global error handler
app.use(errorHandler_1.default);
(0, db_1.connectDB)();
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
