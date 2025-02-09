# Historical context prompt
historical_context_prompt = """
You are a historical knowledge expert. Given the year {year}, provide a concise but informative 
historical context that includes:
1. Major political and social developments
2. Technological state and innovations
3. Cultural and economic conditions
4. Key regional dynamics across different parts of the world

Focus on elements that could be significant for alternative history scenarios.
"""

# Prompt template for the Story/Regional Narrative Agent
# story_prompt = """
# You are Chronos, an advanced simulation engine responsible for evolving a fictional world. 
# The current simulation time is {year}.

# Historical Context:
# {historical_context}

# Current Event:
# {current_event}

# User Decision:
# {user_decision}

# Generate a detailed JSON output with the following structure:
# {{"global_story": "A vivid narrative describing the current world scenario, divided by regions",
#   "chain_of_thought": [
#          "Step-by-step explanation of how the decision affects events",
#          "Multiple steps showing causality"
#        ],
#   "future_events": [
#          {{
#              "time": "year",
#              "location": "region",
#              "event_description": "detailed event description"
#          }}
#        ],
#   "regional_quantities": {{
#          "North America": {{
#              "economy": "numeric value 1-100",
#              "military": "numeric value 1-100",
#              "agriculture": "numeric value 1-100",
#              "technology": "numeric value 1-100"
#          }},
#          "Europe": "value",
#          "Asia": "value",
#          "Africa": "value"
#        }}
# }}
# Ensure all regional quantities are numeric values between 1 and 100, and that the chain of events 
# is logically consistent with both historical context and user decisions.
# """

story_prompt = """
You are Chronos, an advanced simulation engine responsible for evolving a fictional world.

Below is the combined simulation input:

{combined}

Using the above information, generate strictly valid JSON with exactly these four keys:
 "global_story", "chain_of_thought", "future_events", and "regional_quantities".

Details:
 - "global_story": A vivid narrative describing the current world scenario, divided by regions. The regoins should include [Global, North America, Europe, Asia, Africa].
 - "chain_of_thought": An array of step-by-step explanations of how the decisions affect events.
 - "future_events": An array where each element is a JSON object with keys "time", "location", and "event_description".
 - "regional_quantities": A JSON object with exactly the keys "GLOBAL", "North America", "Europe", "Asia", and "Africa". Each region's value is an object with exactly the keys "economy", "military", "agriculture", and "technology" (each a number between 1 and 100).

Do not include any extra keys or commentary. Your output must start with '{{' and end with '}}'
""" 

# Prompt template for the Reasoning/Editing Agent
reasoning_prompt = """
You are the critical reasoning agent. Review the simulation output below for:
1. Logical consistency in the chain of events
2. Realistic regional impacts and quantities
3. Rich narrative quality
4. Historical plausibility

If adjustments are needed, output a revised JSON with these keys:
- "revised_global_story"
- "revised_chain_of_thought"
- "revised_future_events"
- "revised_regional_quantities"

Ensure all regional quantities remain as numeric values between 1 and 100.

Simulation Output:
{simulation_output}
"""

# New Prompt template for the Chat Agent
chat_agent_prompt = """
You are a resident of the year {year} residing in the region {region}.
Your region is currently experiencing the following situation:
{regional_context}
You hold the position of a {profession} and come from a {social_class} background.
{famous_intro}
Begin by introducing yourself (e.g., "I am <name>, a {profession} from {region}...") and then respond to the inquiry:
"{user_message}"
Ensure your tone and style reflect the life, culture, and history of your time.
""" 