from collections import defaultdict
from datetime import datetime, timedelta

from sklearn.ensemble import IsolationForest

from app.db.database import SessionLocal
from app.db.models import UserActivity


def prepare_data():
    db = SessionLocal()
    activities = db.query(UserActivity).all()

    user_data = defaultdict(list)

    for act in activities:
        user_data[act.user].append(act)

    dataset = []

    for user, logs in user_data.items():
        total_requests = len(logs)

        endpoints = set([log.endpoint for log in logs])
        unique_endpoints = len(endpoints)

        # last 1 min requests
        now = datetime.utcnow()
        last_min = [log for log in logs if log.timestamp >= now - timedelta(minutes=1)]
        rpm = len(last_min)

        dataset.append(
            {
                "user": user,
                "total_requests": total_requests,
                "unique_endpoints": unique_endpoints,
                "requests_per_min": rpm,
            }
        )

    db.close()
    return dataset


def train_model(data):
    X = []

    for d in data:
        X.append([d["total_requests"], d["unique_endpoints"], d["requests_per_min"]])

    model = IsolationForest(contamination=0.2)
    model.fit(X)

    preds = model.predict(X)

    for i, user in enumerate(data):
        print(user["user"], "→", "FRAUD" if preds[i] == -1 else "NORMAL")


if __name__ == "__main__":
    data = prepare_data()
    train_model(data)
