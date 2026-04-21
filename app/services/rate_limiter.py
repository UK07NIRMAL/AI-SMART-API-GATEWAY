from app.core.redis import redis_client

WINDOW = 60


def get_limit(identifier: str):
    if "trusted" in identifier:
        return 200
    elif "heavy" in identifier:
        return 50
    return 100


def is_allowed(identifier: str):
    key = f"rate_limit:{identifier}"

    limit = get_limit(identifier)

    current = redis_client.get(key)

    if current and int(current) >= limit:
        return False

    pipe = redis_client.pipeline()
    pipe.incr(key, 1)
    pipe.expire(key, WINDOW)
    pipe.execute()

    return True
