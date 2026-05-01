const stores = new Map();

const getClientKey = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || 'unknown';
};

exports.createRateLimiter = ({ windowMs, maxRequests, message }) => {
  return (req, res, next) => {
    const key = `${req.baseUrl}:${req.path}:${getClientKey(req)}`;
    const now = Date.now();
    const entry = stores.get(key);

    if (!entry || now > entry.expiresAt) {
      stores.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ message });
    }

    entry.count += 1;
    next();
  };
};
