import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import Logger from "bunyan";
import HTTP_STATUS from "http-status-codes";
import session from "express-session";
import connectRedis, { Client } from "connect-redis";
import { createClient } from "redis";
import applicationRoutes from "./routes";
import { IErrorResponse, CustomError } from "./utils/error-handler";
import { RedisStore, redisClient } from "./config/redis";

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.redisSessionMiddleware(this.app); // <-- Add Redis session middleware
    this.routesMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.startServer(this.app);
    this.globalErrorHandler(this.app);
  }

  private redisSessionMiddleware(app: Application): void {
    // const redisClient = createClient({
    //   url: process.env.REDIS_URL
    // });
  
    // // Connect to Redis
    // redisClient.connect().catch(console.error);
  
    // // Initialize Redis store
    // const RedisStore = connectRedis(session);
  
    // Configure session middleware
    app.use(
      session({
        store: new RedisStore({ client: redisClient as unknown as any }),  // Type assertion to resolve TS issue
        secret: process.env.SESSION_SECRET || "your_secret_key", // Replace with a secure secret in production
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true, // Use 'true' if using HTTPS
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
    app.disable("x-powered-by");
  }

  private routesMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
    app.disable("x-powered-by");
    applicationRoutes(app);
  }

  private apiMonitoring(app: Application): void {
    // You can add your API monitoring logic here
  }

  private securityMiddleware(app: Application): void {
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }

        res.status(HTTP_STATUS.BAD_REQUEST).send({
          status: "BAD_REQUEST",
          message: error.message ?? "Something went wrong.",
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
      }
    );
  }

  private startServer(app: Application): void {
    app.listen(process.env.PORT, async () =>
      console.log(`Listening on port ${process.env.PORT}`)
    );
  }
}
