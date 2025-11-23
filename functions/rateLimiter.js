// Rate limiter simples
const userCooldowns = new Map();

export function checkRateLimit(userId, cooldownMs = 3000) {
    const now = Date.now();
    const lastUsed = userCooldowns.get(userId);
    
    if (lastUsed && (now - lastUsed) < cooldownMs) {
        return { limited: true, remaining: Math.ceil((cooldownMs - (now - lastUsed)) / 1000) };
    }
    
    userCooldowns.set(userId, now);
    return { limited: false };
}

// Limpar cooldowns antigos a cada 5 minutos
setInterval(() => {
    const now = Date.now();
    for (const [userId, timestamp] of userCooldowns.entries()) {
        if (now - timestamp > 300000) {
            userCooldowns.delete(userId);
        }
    }
}, 300000);
