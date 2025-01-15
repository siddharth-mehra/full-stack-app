import {z} from "zod";

export const VerifySchema = z.object({
    code: z.string().length(6,"Verification code must me 6 digit")
})

