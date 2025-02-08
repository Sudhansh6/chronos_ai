import os

def get_historical_context(year):
    # Construct the file path relative to this file's directory.
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "historical", f"{year}.txt")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    else:
        return "Historical context not available for the requested year." 