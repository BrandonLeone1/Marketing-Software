import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';
import router from './routes/auth.routes.js';
import campaignRouter from './routes/campaign.routes.js'
import metricsRouter from './routes/metrics.routes.js';
import analyticsRouter from './routes/analytics.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: ['http://localhost:5173', "https://www.metricflows.xyz"],
    credentials: true
}));

app.use(helmet());


const overallLimit = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 50,
    message: "Sending too many requests. Please slow down your actions or stop refreshing the page as quick.",
    standardHeaders: 'draft-8',
    legacyHeaders: false
})

app.use(overallLimit);


declare global {
  namespace Express {
    interface Request {
      userid?: string | undefined
    }
  }
}


const authRoutes = router;
const campaignRoutes = campaignRouter;
const metricsRoutes = metricsRouter;
const analyticsRoutes = analyticsRouter;

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/analytics", analyticsRoutes);


export default app;

