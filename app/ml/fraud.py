from sklearn.ensemble import IsolationForest

from app.ml.train import prepare_data


def detect_fraud(current_user: str) -> bool:

    data = prepare_data()

    # Not enough data to train a reliable model
    if len(data) < 10:
        return False

    X = []
    users = []

    for record in data:
        X.append(
            [
                record["total_requests"],
                record["unique_endpoints"],
                record["requests_per_min"],
            ]
        )
        users.append(record["user"])

    # Unsupervised anomaly detection model
    model = IsolationForest(contamination=0.2, random_state=42)

    model.fit(X)

    predictions = model.predict(X)

    # -1 = Anomaly
    #  1 = Normal
    for index, user in enumerate(users):
        if user == current_user:
            return predictions[index] == -1

    # User not found in dataset
    return False
