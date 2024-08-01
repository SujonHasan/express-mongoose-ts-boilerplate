import apiResponse from "@utils/apiResponse";
import catchAsync from "@utils/catchAsync";
import httpStatus from "http-status";

const baseUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return apiResponse(res, httpStatus.OK, {
      message: "Welcome to home page....!!",
    });
  }
);

export { baseUrl };
