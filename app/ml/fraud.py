from sklearn.ensemble import IsolationForest

from app.ml.train import prepare_data


def detect_fraud(current_user: str):
    data = prepare_data()

    X = []
    users = []

    for d in data:
        X.append([d["total_requests"], d["unique_endpoints"], d["requests_per_min"]])
        users.append(d["user"])

    model = IsolationForest(contamination=0.2)
    model.fit(X)

    preds = model.predict(X)

    for i, user in enumerate(users):
        if user == current_user:
            return preds[i] == -1

    return False
