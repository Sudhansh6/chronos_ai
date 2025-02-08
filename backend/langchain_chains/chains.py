import json
from langchain.chains import LLMChain, SequentialChain
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from .prompts import story_prompt, reasoning_prompt, historical_context_prompt, chat_agent_prompt
from config.settings import OPENAI_API_KEY, MODEL_NAME, TEMPERATURE
from typing import Dict, Any, List

import random

import os
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

STATEFUL_CHAT_AGENT_CHAIN = None
LATEST_SIMULATION_RESULT = None
STATEFUL_SIMULATION_CHAIN = None

def combine_simulation_inputs(year: str, historical_context: str, current_event: str, user_decision: str) -> str:
    """
    Wrap the multiple simulation inputs into one string.
    You can choose any formatting you like. Here we use a simple newline-separated format.
    """
    return (
        f"Year: {year}\n"
        f"Historical Context: {historical_context}\n"
        f"Current Event: {current_event}\n"
        f"User Decision: {user_decision}"
    )

def build_historical_context_chain():
    """Creates a chain for retrieving and formatting historical context."""
    llm = ChatOpenAI(temperature=TEMPERATURE, model_name=MODEL_NAME)
    
    context_template = PromptTemplate(
        input_variables=["year"],
        template=historical_context_prompt
    )
    
    context_chain = LLMChain(
        llm=llm,
        prompt=context_template,
        output_key="historical_context"
    )
    return context_chain

def build_simulation_chain():
    global STATEFUL_SIMULATION_CHAIN
    if STATEFUL_SIMULATION_CHAIN is not None:
        return STATEFUL_SIMULATION_CHAIN

    # Initialize the LLM; additional parameters can be adjusted as needed.
    story_llm = ChatOpenAI(temperature=TEMPERATURE, model_name=MODEL_NAME)
    story_memory = ConversationBufferMemory(memory_key="history", return_messages=True)
    reasoning_llm = ChatOpenAI(temperature=TEMPERATURE, model_name=MODEL_NAME)
    # reasoning_memory = ConversationBufferMemory(memory_key="history", return_messages=True)
    
    # Story generation chain
    story_template = PromptTemplate(
        input_variables=["combined"],
        # input_variables=["year", "historical_context", "current_event", "user_decision"],
        template=story_prompt
    )
    story_chain = LLMChain(
        llm=story_llm,
        prompt=story_template,
        output_key="simulation_output",
        memory=story_memory
    )
    
    # Reasoning/editing chain
    reasoning_template = PromptTemplate(
        input_variables=["simulation_output"],
        template=reasoning_prompt
    )
    reasoning_chain = LLMChain(
        llm=reasoning_llm,
        prompt=reasoning_template,
        output_key="refined_output",
        # memory=reasoning_memory
    )
    
    # Combine chains
    simulation_chain = SequentialChain(
        chains=[story_chain, reasoning_chain],
        input_variables=["combined"],
        # input_variables=["year", "historical_context", "current_event", "user_decision"],
        output_variables=["simulation_output", "refined_output"],
        verbose=True,
    )
    
    STATEFUL_SIMULATION_CHAIN = simulation_chain
    return simulation_chain

def parse_simulation_output(output: str) -> Dict[str, Any]:
    """Parse and validate the simulation output JSON."""
    try:
        # Clean the output string (remove markdown code blocks if present)
        if output.startswith("```") and output.endswith("```"):
            output = output.split("```")[1]
            if output.startswith("json"):
                output = output[4:]
        
        data = json.loads(output.strip())
        
        # Validate required keys
        required_keys = ["global_story", "chain_of_thought", "future_events", "regional_quantities"]
        for key in required_keys:
            if key not in data:
                raise ValueError(f"Missing required key: {key}")
        
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON output: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error parsing simulation output: {str(e)}")

def run_simulation(
    year: str,
    current_event: str,
    user_decision: str
) -> Dict[str, Any]:
    """Run the complete simulation pipeline."""
    # Get historical context
    context_chain = build_historical_context_chain()
    context_result = context_chain({"year": year})
    historical_context = context_result["historical_context"]

    combined_input = combine_simulation_inputs(year, historical_context, current_event, user_decision)
    
    # Run main simulation
    simulation_chain = build_simulation_chain()
    # result = simulation_chain({
    #     "year": year,
    #     "historical_context": historical_context,
    #     "current_event": current_event,
    #     "user_decision": user_decision
    # })
    result = simulation_chain({
        "combined": combined_input
    })
    
    # final_output = parse_simulation_output(result["refined_output"])
    combined_input = combine_simulation_inputs(year, historical_context, current_event, user_decision)
    result = simulation_chain({
        "combined": combined_input
    })
    
    global LATEST_SIMULATION_RESULT
    # LATEST_SIMULATION_RESULT = final_output
    final_output = result["simulation_output"]
    LATEST_SIMULATION_RESULT = final_output

    return {
        "success": True,
        # "data": final_output,
        "data": result["simulation_output"],
        "historical_context": historical_context
    }
    # try:
    #     # Get historical context
    #     context_chain = build_historical_context_chain()
    #     context_result = context_chain({"year": year})
    #     historical_context = context_result["historical_context"]
        
    #     # Run main simulation
    #     simulation_chain = build_simulation_chain()
    #     result = simulation_chain({
    #         "year": year,
    #         "historical_context": historical_context,
    #         "current_event": current_event,
    #         "user_decision": user_decision
    #     })
        
    #     final_output = parse_simulation_output(result["refined_output"])
        
    #     global LATEST_SIMULATION_RESULT
    #     LATEST_SIMULATION_RESULT = final_output

    #     return {
    #         "success": True,
    #         "data": final_output,
    #         "historical_context": historical_context
    #     }
    # except Exception as e:
    #     return {
    #         "success": False,
    #         "error": str(e)
    #     }

# Helper function to generate a random historical agent identity.
def generate_agent_identity(region: str, year: str) -> dict:
    is_famous = random.random() < 0.5
    if is_famous:
        # famous_persons = {
        #     "Europe": "Leonardo da Vinci",
        #     "North America": "Benjamin Franklin",
        #     "Asia": "Confucius",
        #     "Africa": "Mansa Musa",
        # }
        # name = famous_persons.get(region, "Famous Persona")
        profession = "renowned scholar"
        social_class = "elite"
        famous_intro = "You should be a person who is recognized as a celebrated figure of your time in your region."
    else:
        # nonfamous_names = ["John", "Alice", "Marcus", "Fatima", "Hiroshi", "Amina"]
        # name = random.choice(nonfamous_names)
        professions = ["merchant", "farmer", "blacksmith", "scribe", "artisan"]
        profession = random.choice(professions)
        social_classes = ["working-class", "middle-class", "commoner"]
        social_class = random.choice(social_classes)
        famous_intro = ""
    return {
        "profession": profession,
        "social_class": social_class,
        "famous_intro": famous_intro,
        "is_famous": is_famous
    }

# New function to build the Chat Agent chain.
def build_chat_agent_chain(chat_flag: bool):
    global STATEFUL_CHAT_AGENT_CHAIN
    if not chat_flag or STATEFUL_CHAT_AGENT_CHAIN is None:
        llm = ChatOpenAI(temperature=TEMPERATURE, model_name=MODEL_NAME)
        # memory = ConversationBufferMemory(memory_key="history", return_messages=True)
        # Import the new chat agent prompt template
        chat_template = PromptTemplate(
            input_variables=["year", 
                            "region", 
                            "user_message", 
                            "regional_context", 
                            "profession", 
                            "social_class", 
                            "famous_intro"],
            template=chat_agent_prompt,
        )
        chat_chain = LLMChain(llm=llm, 
                            prompt=chat_template, 
                            output_key="chat_response",
                            # memory=memory
                            )
        STATEFUL_CHAT_AGENT_CHAIN = chat_chain
    else:
        chat_chain = STATEFUL_CHAT_AGENT_CHAIN
    return chat_chain

# New function to interact with the Chat Agent.
def chat_with_user(year: str, 
                   region: str, 
                   user_message: str,
                   chat_flag: bool,
                   regional_context: str = "No additional context available."):
    identity = generate_agent_identity(region, year)
    chat_chain = build_chat_agent_chain(chat_flag)
    result = chat_chain({
        "year": year,
        "region": region,
        "user_message": user_message,
        "regional_context": regional_context,
        "profession": identity["profession"],
        "social_class": identity["social_class"],
        "famous_intro": identity["famous_intro"],
    })

    # Utility to clean potential markdown code fences from the output
    def clean_output(output: str) -> str:
        if output.startswith("```"):
            lines = output.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            output = "\n".join(lines)
        return output.strip()

    chat_response = clean_output(result["chat_response"])
    return chat_response

def get_events_by_year(year: str) -> Dict[str, Any]:
    """
    Retrieve events from the latest simulation result.
    Group future events by region.
    """
    if not LATEST_SIMULATION_RESULT:
        raise ValueError("No simulation result available. Run simulation first.")
    events = LATEST_SIMULATION_RESULT.get("future_events")
    if not events:
        raise ValueError("No future events found in the simulation result.")
    events_by_region = {}
    for event in events:
        print(">>>>>>>>>>event: ", event)
        event = json.loads(event)
        region = event.get("location", "Unknown")
        events_by_region.setdefault(region, []).append(event["event_description"])
    return events_by_region

def get_quantities_by_year_and_region(year: str, region: str) -> Dict[str, Any]:
    """
    Retrieve regional quantities from the latest simulation result.
    """
    if not LATEST_SIMULATION_RESULT:
        raise ValueError("No simulation result available. Run simulation first.")
    quantities = LATEST_SIMULATION_RESULT.get("regional_quantities")
    if not quantities or region not in quantities:
        raise ValueError(f"No quantities found for region {region}.")
    return quantities[region] 