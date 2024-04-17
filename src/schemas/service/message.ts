import { z } from "zod";

const createMessageSchema = z.object({
    recipientId: z.number().int(),
    subject: z.string(),
    body: z.string()
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

const getMessagesSchema = z.object({
    offset: z.number().int(),
    isSent: z.boolean()
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;

const deleteMessagesSchema = z.object({
    messageIds: z.array(z.number().int()),
    isSent: z.boolean()
});

export type DeleteMessagesInput = z.infer<typeof deleteMessagesSchema>;