const commonCorrections: { pattern: RegExp; correction: string; rule: string }[] = [
  { pattern: /\bI am agree\b/i, correction: 'I agree', rule: '"Agree" is a verb, not an adjective — don\'t use "am" with it' },
  { pattern: /\bmore big\b/i, correction: 'bigger', rule: 'Short adjectives take -er (bigger), not "more" (more big)' },
  { pattern: /\bmore good\b/i, correction: 'better', rule: '"Good" becomes "better" in comparative form (not "more good")' },
  { pattern: /\bthe people is\b/i, correction: 'the people are', rule: '"People" is plural — use "are" not "is"' },
  { pattern: /\bhe don't\b/i, correction: "he doesn't", rule: 'Third person singular (he/she/it) uses "doesn\'t" not "don\'t"' },
  { pattern: /\byesterday I go\b/i, correction: 'yesterday I went', rule: 'Use past tense (went) when talking about yesterday' },
]

function generateCorrections(message: string): { original: string; correction: string; rule: string }[] {
  const corrections: { original: string; correction: string; rule: string }[] = []
  for (const { pattern, correction, rule } of commonCorrections) {
    const match = message.match(pattern)
    if (match && corrections.length < 2) {
      corrections.push({ original: match[0].trim(), correction, rule })
    }
  }
  return corrections
}

function generateScore(_message: string): number {
  return Math.floor(Math.random() * 15) + 75
}

export function generateResponse(
  message: string,
  _messageHistory: { sender: string; content: string }[],
): {
  content: string
  corrections: { original: string; correction: string; rule: string }[]
  score: number
} {
  if (!message || !message.trim()) {
    return { content: "Hi! I'm your AI English coach. What would you like to talk about?", corrections: [], score: 0 }
  }

  const corrections = generateCorrections(message)
  const score = generateScore(message)

  const hasGrammarIssue = corrections.length > 0
  const tip = hasGrammarIssue
    ? `\n\nYour sentence has a small grammar point worth noting:\n${corrections.map(c => `- "${c.original}" should be "${c.correction}" (${c.rule})`).join('\n')}`
    : ''

  const responses = [
    `Thanks for your message! I'd be happy to discuss that.${tip}`,
    `I hear you! Let me respond to what you just said.${tip}`,
    `Great point! Here are my thoughts on that.${tip}`,
  ]

  const content = responses[Math.floor(Math.random() * responses.length)]

  return { content, corrections, score }
}
