from collections import defaultdict
from datetime import datetime, timedelta

from sklearn.ensemble import IsolationForest

from app.db.database import SessionLocal
from app.db.models import UserActivity


def prepare_data():
    """
    Prepare user activity data for the fraud detection model.
    """

    db = SessionLocal()

    try:
        activities = db.query(UserActivity).all()

        user_data = defaultdict(list)

        for activity in activities:
            user_data[activity.user].append(activity)

        dataset = []

        now = datetime.utcnow()

        for user, logs in user_data.items():

            total_requests = len(logs)

            unique_endpoints = len({log.endpoint for log in logs})

            requests_per_min = len(
                [log for log in logs if log.timestamp >= now - timedelta(minutes=1)]
            )

            dataset.append(
                {
                    "user": user,
                    "total_requests": total_requests,
                    "unique_endpoints": unique_endpoints,
                    "requests_per_min": requests_per_min,
                }
            )

        return dataset

    finally:
        db.close()


def train_model(data):
    """
    Train the Isolation Forest model and print predictions.
    Used only for testing and development.
    """

    if len(data) < 5:
        print("Not enough training data.")
        return

    X = [
        [
            user["total_requests"],
            user["unique_endpoints"],
            user["requests_per_min"],
        ]
        for user in data
    ]

    model = IsolationForest(
        contamination=0.2,
        random_state=42,
    )

    model.fit(X)

    predictions = model.predict(X)

    print("\n========== FRAUD DETECTION REPORT ==========\n")

    for index, user in enumerate(data):

        status = "FRAUD" if predictions[index] == -1 else "NORMAL"

        print(f"{user['user']:<25} --> {status}")

    print("\n============================================\n")


if __name__ == "__main__":
    dataset = prepare_data()
    train_model(dataset)
