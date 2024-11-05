import {ZodError, ZodIssue} from "zod";

export const ConvertZodErrorToMapString = (zodError: ZodError): Map<string, string> => {
    return zodError.issues.reduce((map: Map<string, string>, issue: ZodIssue) => {
        if(typeof issue.path[0] === "string") {
            map.set(issue.path[0], issue.message);
        }

        return map;
    }, new Map<string, string>());
}