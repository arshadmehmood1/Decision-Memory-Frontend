export const CHALLENGE_PROMPTS = [
    "What specific data points led you to this conclusion?",
    "If this assumption is wrong, what is the worst-case scenario?",
    "How could you verify this within 24 hours?",
    "Have you spoken to at least 3 people who disagree?",
    "What would have to be true for the opposite to be valid?",
    "Is this a fact, an opinion, or a guess?",
    "What is the source of this belief?",
    "If you had to bet $1000 on this, would you still take the bet?",
    "Is this assumption based on past experience that may no longer be relevant?",
    "Could this be a lagging indicator instead of a leading one?"
];

export function getRandomChallenge(): string {
    const randomIndex = Math.floor(Math.random() * CHALLENGE_PROMPTS.length);
    return CHALLENGE_PROMPTS[randomIndex];
}
