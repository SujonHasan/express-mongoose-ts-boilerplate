import logger from "./logger";
import morgan from 'morgan';

/***Creating new tokens
To define a token, simply invoke morgan.token() with the name and a callback function. This callback function is expected to return a string value. The value returned is then available as ":type" in this case: */
morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

/**
 * 
 * combined
Standard Apache combined log output.
 */
const getIpFormat = () => (process.env.NODE_ENVIRONMENT === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode >= 400,
    stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: { write: (message: string) => logger.error(message.trim()) },
});


export default {
    successHandler,
    errorHandler
}