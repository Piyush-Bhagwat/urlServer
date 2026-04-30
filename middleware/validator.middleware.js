import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse(req.body);
        req.body = result;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};