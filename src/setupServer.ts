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

import applicationRoutes from "./routes";

import { IErrorResponse, CustomError } from "./utils/error-handler";

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.startServer(this.app);
    this.globalErrorHandler(this.app);
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

  private apiMonitoring(app: Application): void {}

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
        // log.error(error);
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
