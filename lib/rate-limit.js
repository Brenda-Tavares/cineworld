// Rate limiting por IP, em memória.
//
// Limitacao conhecida: em ambiente serverless o estado vive apenas na
// instancia que atendeu a requisicao. Cada instancia livre conta de forma
// independente, entao o limite e aproximado. Use como barreira contra abuso
// e custo de API, não como controle exato de cota.

const WINDOW_MS = 60 * 1000;
const MAX_TRACKED_CLIENTS = 2000;

function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
        return forwarded.split(',')[0].trim();
    }
    return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function createLimiter({ limit, windowMs = WINDOW_MS, message }) {
    const hits = new Map();

    function prune(now) {
        for (const [key, timestamps] of hits) {
            const alive = timestamps.filter(t => now - t < windowMs);
            if (alive.length === 0) hits.delete(key);
            else hits.set(key, alive);
        }
    }

    return function check(req, res) {
        const now = Date.now();
        const key = clientIp(req);

        if (hits.size > MAX_TRACKED_CLIENTS) prune(now);

        const timestamps = (hits.get(key) || []).filter(t => now - t < windowMs);

        if (timestamps.length >= limit) {
            const retryAfter = Math.max(1, Math.ceil((windowMs - (now - timestamps[0])) / 1000));
            res.setHeader('Retry-After', String(retryAfter));
            res.status(429).json({ error: message || 'Muitas requisicoes. Tente novamente em instantes.', retryAfter });
            return false;
        }

        timestamps.push(now);
        hits.set(key, timestamps);
        return true;
    };
}

module.exports = { createLimiter, clientIp };