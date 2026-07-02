import logging

import redis

from app.core.redis import redis_client

logger = logging.getLogger(__name__)

WINDOW = 60


def get_limit(identifier: str):
    if "trusted" in identifier:
        return 200
    elif "heavy" in identifier:
        return 50
    return 100


def is_allowed(identifier: str):
    try:
        key = f"rate_limit:{identifier}"

        limit = get_limit(identifier)

        current = redis_client.get(key)

        if current and int(current) >= limit:
            return False

        pipe = redis_client.pipeline()

        pipe.incr(key)

        if not current:
            pipe.expire(key, WINDOW)

        pipe.execute()

        return True

    except redis.RedisError as e:
        logger.error(f"Redis Error: {e}")

        return True
