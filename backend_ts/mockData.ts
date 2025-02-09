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