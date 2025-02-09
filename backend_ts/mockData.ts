export const MOCK_DATA = {
  global_story: {
    "Global": "By 1800, the world is witnessing a remarkable surge in industrialization...",
    "North America": "In the United States, the early advent of industrialization...",
    "Europe": "European nations are grappling with the implications...",
    "Asia": "The Qing Dynasty is facing unprecedented challenges...",
    "Africa": "In Africa, the transatlantic slave trade continues..."
  },
  chain_of_thought: [
    "The early onset of industrialization leads to a faster economic transformation...",
    "In Europe, the spread of factories and the demand for workers..."
  ],
  future_events: [
    { time: "1805", location: "North America", event_description: "The U.S. Congress passes..." },
    { time: "1806", location: "Europe", event_description: "The Battle of Austerlitz..." }
  ],
  regional_quantities: {
    "GLOBAL": { economy: 75, military: 60, agriculture: 50, technology: 80 },
    "North America": { economy: 70, military: 50, agriculture: 65, technology: 75 },
    "Europe": { economy: 80, military: 70, agriculture: 55, technology: 85 },
    "Asia": { economy: 50, military: 40, agriculture: 60, technology: 45 },
    "Africa": { economy: 40, military: 30, agriculture: 70, technology: 35 }
  }
};

export const MOCK_DATA2 = {
  global_story: {
    "Global": "The world teeters on the edge of a transformative epoch...",
    "North America": "In the United States, the anticipation of the Louisiana Purchase...",
    "Europe": "Europe is a powder keg of revolutionary fervor...",
    "Asia": "In Asia, the Qing Dynasty struggles to maintain control...",
    "Africa": "Africa remains fragmented..."
  },
  chain_of_thought: [
    "The rising tensions in Europe could lead to earlier conflicts...",
    "In North America, the impending Louisiana Purchase may intensify..."
  ],
  future_events: [
    { time: "1803", location: "United States", event_description: "The Louisiana Purchase..." },
    { time: "1804", location: "France", event_description: "Napoleon Bonaparte declares..." }
  ],
  regional_quantities: {
    "GLOBAL": { economy: 60, military: 55, agriculture: 70, technology: 40 },
    "North America": { economy: 65, military: 50, agriculture: 75, technology: 45 },
    "Europe": { economy: 70, military: 80, agriculture: 60, technology: 55 },
    "Asia": { economy: 50, military: 65, agriculture: 80, technology: 30 },
    "Africa": { economy: 40, military: 30, agriculture: 50, technology: 20 }
  }
}; 

export const MOCK_DATA3 = {
    "content": {
        "Overview": {
            "Global": {
                "text": "The year 1800 marks a crucial turning point in world history, characterized by the rise of nationalism, the onset of the Napoleonic Wars, and significant technological and social changes. The world witnessed a surge in independence movements, economic transitions, and early industrialization.",
                "score": 0
            },
            "North America": {
                "text": "As the United States expanded westward, tensions grew between colonizers and Indigenous populations. The looming Louisiana Purchase promised vast territorial gains but also foreshadowed conflicts. The influence of Enlightenment ideas began to inspire movements for independence in Latin America.",
                "score": 29
            },
            "Europe": {
                "text": "Europe was engulfed in conflict and transformation due to the Napoleonic Wars. Nationalism surged, leading to revolutionary ideals spreading across the continent. The decline of the Holy Roman Empire and the rise of nation-states marked a significant geopolitical shift.",
                "score": 54
            },
            "Asia": {
                "text": "In Asia, the British East India Company's grip on India tightened, while the Qing dynasty in China faced internal strife and external pressures from European powers. These dynamics set the stage for future colonial expansions and conflicts.",
                "score": 38
            },
            "Africa": {
                "text": "Africa was deeply affected by the transatlantic slave trade, with European powers exploiting various regions. The Ashanti Empire thrived amidst the turmoil of colonization, while other areas faced significant challenges from European encroachment.",
                "score": 19
            }
        },
        "Economy": {
            "North America": {
                "text": "Economy in North America faces challenges with basic infrastructure and trade",
                "score": 30
            },
            "Europe": {
                "text": "Economy in Europe faces challenges with basic infrastructure and trade",
                "score": 60
            },
            "Asia": {
                "text": "Economy in Asia faces challenges with basic infrastructure and trade",
                "score": 40
            },
            "Africa": {
                "text": "Economy in Africa faces challenges with basic infrastructure and trade",
                "score": 20
            }
        },
        "Military": {
            "North America": {
                "text": "Military in North America requires modernization and better organization",
                "score": 20
            },
            "Europe": {
                "text": "Military in Europe maintains adequate defense capabilities",
                "score": 70
            },
            "Asia": {
                "text": "Military in Asia requires modernization and better organization",
                "score": 30
            },
            "Africa": {
                "text": "Military in Africa requires modernization and better organization",
                "score": 15
            }
        },
        "Agriculture": {
            "North America": {
                "text": "Agriculture in North America struggles to meet population demands",
                "score": 40
            },
            "Europe": {
                "text": "Agriculture in Europe struggles to meet population demands",
                "score": 50
            },
            "Asia": {
                "text": "Agriculture in Asia struggles to meet population demands",
                "score": 60
            },
            "Africa": {
                "text": "Agriculture in Africa struggles to meet population demands",
                "score": 30
            }
        },
        "Technology": {
            "North America": {
                "text": "Technology in North America lags behind in technological infrastructure",
                "score": 25
            },
            "Europe": {
                "text": "Technology in Europe lags behind in technological infrastructure",
                "score": 35
            },
            "Asia": {
                "text": "Technology in Asia lags behind in technological infrastructure",
                "score": 20
            },
            "Africa": {
                "text": "Technology in Africa lags behind in technological infrastructure",
                "score": 10
            }
        },
        "Future Events": {
            "North America": {
                "text": "1803: The Louisiana Purchase effectively doubles the size of the United States, sparking westward expansion.",
                "score": 0
            },
            "Haiti": {
                "text": "1804: Haiti declares independence from France, becoming the first free black republic.",
                "score": 0
            },
            "Europe": {
                "text": "1805: The Battle of Austerlitz takes place, leading to a significant victory for Napoleon and the dissolution of the Holy Roman Empire.",
                "score": 0
            },
            "Latin America": {
                "text": "1810: The independence movements gain momentum in Latin America, led by figures such as Simón Bolívar.",
                "score": 0
            }
        }
    },
    "totalScore": 34.6875
}