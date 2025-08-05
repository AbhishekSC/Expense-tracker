import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import transactionRoutes from './routes/transaction.route.js';
import budgetRoutes from './routes/budget.route.js';
import dashboardRoutes from './routes/dashboard.route.js';

const app= express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;

