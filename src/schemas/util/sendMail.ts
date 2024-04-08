import { z } from "zod";

const mailInfoObjSchema = z.object({
    title: z.string(),
    recipient: z.string(),
    body: z.string()
});

export type mailInfoObj = z.infer<typeof mailInfoObjSchema>;