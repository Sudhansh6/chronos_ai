from backend.langchain_chains.chains import run_simulation

class BackendMain:
    def __init__(self):
        self.history_dict = {}

    def simulate_year(self, year: str, current_event: str = None, user_decision: str = None) -> dict:
        if current_event is None:
            current_event = "The world stands on the brink of change; subtle signs of unrest are emerging globally."
        if user_decision is None:
            user_decision = "No decision made yet."
        
        simulation_result = run_simulation(year, current_event, user_decision)
        if not simulation_result.get("success"):
            print("Simulation error:", simulation_result.get("error"))
        else:
            print("\nInitial Simulation Output:")
            import json
            try:
                simulation_result = json.loads(simulation_result["data"])
                print(simulation_result)
            except json.JSONDecodeError as e:
                print("Error parsing JSON output:", e)
                print(simulation_result)

        self.history_dict[year] = simulation_result
        return simulation_result

    def get_history(self, year: str) -> dict:
        return self.history_dict.get(year, None)
    
    def get_all_history(self) -> dict:
        return self.history_dict

    
    
    