const { StatusCodes } = require("http-status-codes");
const { ZodError } = require("zod");

const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody; 
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // It's a Zod validation error
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    next(error);
  }
};

module.exports = { validate };
