import { z } from "zod";

const createMessageSchema = z.object({
    recipientId: z.number().int(),
    subject: z.string(),
    body: z.string()
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;