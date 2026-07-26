import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .optional(),
  nativeLanguage: z.string().min(2).max(10).optional(),
  targetLanguage: z.string().min(2).max(10).optional(),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  dailyGoalMinutes: z.number().min(5).max(180).optional(),
  bio: z.string().max(500).optional(),
})

export const createConversationSchema = z.object({
  topic: z
    .string()
    .min(2, 'Topic must be at least 2 characters')
    .max(100, 'Topic must be at most 100 characters')
    .optional(),
  scenario: z
    .string()
    .min(2, 'Scenario must be at least 2 characters')
    .max(100, 'Scenario must be at most 100 characters')
    .optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
})

export const saveWordSchema = z.object({
  word: z.string().min(1, 'Word is required').max(100),
  definition: z.string().min(1, 'Definition is required').max(500),
  partOfSpeech: z.enum([
    'noun',
    'verb',
    'adjective',
    'adverb',
    'preposition',
    'conjunction',
    'pronoun',
    'interjection',
  ]),
  phonetic: z.string().max(100).optional(),
  exampleSentence: z.string().max(500).optional(),
  translation: z.string().max(500).optional(),
  synonyms: z.array(z.string().max(100)).max(20).optional(),
  antonyms: z.array(z.string().max(100)).max(20).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  source: z.string().max(100).optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type SaveWordInput = z.infer<typeof saveWordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
