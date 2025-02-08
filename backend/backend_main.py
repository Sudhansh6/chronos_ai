from langchain_chains.chains import run_simulation

class BackendMain:
    def __init__(self):
        self.history_dict = {}
        self.year = None

    def simulate_year(self, year: str, current_event: str = None, user_decision: str = None) -> dict:
        self.year = year
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
        
        simulation_result["future_events"] = get_events_by_year(year)

        self.history_dict[year] = simulation_result
        return simulation_result

    def get_history(self, year: str) -> dict:
        return self.history_dict.get(year, None)
    
    def get_all_history(self) -> dict:
        return self.history_dict
    
    def chat_with_agent(self, reg, chat_message):
        chat_choice = input("Do you want to chat with a regional agent? (yes/no): ")
        chat_flag = False
        if chat_choice.strip().lower() == "yes":
            if chat_message.strip().lower() == "exit":
                return None
            try:
                quantities = get_quantities_by_year_and_region(self.year, reg)
                regional_context = f"Quantities: {quantities}"
            except Exception as e:
                regional_context = "No additional regional data available."
            chat_response = chat_with_user(self.year, reg, chat_message, regional_context, chat_flag)
            chat_flag = True
            return chat_response

    
    
    