import { z } from "zod"

export const startConversationSchema = z.object({
  mode: z.enum(["free", "guided", "roleplay", "exam", "pronunciation"]),
  topic: z.string().max(100).optional(),
  title: z.string().max(200).optional(),
})

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message content is required").max(5000),
  type: z.enum(["text", "voice"]).optional().default("text"),
  audioUrl: z.string().url().optional(),
  durationMs: z.number().int().positive().optional(),
})

export type StartConversationInput = z.infer<typeof startConversationSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
