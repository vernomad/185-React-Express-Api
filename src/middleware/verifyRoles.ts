import { Response, NextFunction } from "express";
import { CustomRequest } from "./authMiddleware";

// const verifyRoles = (...allowedRoles: string[]) => {
//     return (req: CustomRequest, res: Response, next: NextFunction) => {
//         if (!req?.roles) return res.sendStatus(401);
//         const rolesArray = [...allowedRoles];
//         const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
//         if (!result) return res.sendStatus(401);
//         next();
//     }
// }

const verifyRoles = (...allowedRoles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.roles) return res.sendStatus(401); // Unauthorized if roles do not exist on the request

        // Check if any of the allowed roles match the user's roles
        const hasRole = allowedRoles.includes(req.roles);
        console.log("HasRole:", hasRole);

        if (!hasRole) return res.sendStatus(403); // Forbidden if no roles match
        next();
    }
}

export default verifyRoles;