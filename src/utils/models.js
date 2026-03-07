export const MODELS = [
    // OpenAI
    { name: 'GPT-5.3 Omni', whPer1k: 0.0085, pricePer1kIn: 0.0050, pricePer1kOut: 0.0150, family: 'OpenAI' },
    { name: 'GPT-5.3 Lite', whPer1k: 0.0020, pricePer1kIn: 0.00015, pricePer1kOut: 0.00060, family: 'OpenAI' },
    { name: 'GPT-5.0 Turbo', whPer1k: 0.0045, pricePer1kIn: 0.0010, pricePer1kOut: 0.0030, family: 'OpenAI' },
    { name: 'o4-reasoning', whPer1k: 0.0120, pricePer1kIn: 0.0150, pricePer1kOut: 0.0600, family: 'OpenAI' },
    { name: 'o3-mini', whPer1k: 0.0010, pricePer1kIn: 0.0011, pricePer1kOut: 0.0044, family: 'OpenAI' },

    // Anthropic
    { name: 'Claude 4.6 Opus', whPer1k: 0.0090, pricePer1kIn: 0.0150, pricePer1kOut: 0.0750, family: 'Anthropic' },
    { name: 'Claude 4.6 Sonnet', whPer1k: 0.0035, pricePer1kIn: 0.0030, pricePer1kOut: 0.0150, family: 'Anthropic' },
    { name: 'Claude 4.6 Haiku', whPer1k: 0.0008, pricePer1kIn: 0.00025, pricePer1kOut: 0.00125, family: 'Anthropic' },
    { name: 'Claude 4.0 Opus', whPer1k: 0.0065, pricePer1kIn: 0.0150, pricePer1kOut: 0.0750, family: 'Anthropic' },

    // Google
    { name: 'Gemini 3.1 Ultra', whPer1k: 0.0080, pricePer1kIn: 0.0070, pricePer1kOut: 0.0210, family: 'Google' },
    { name: 'Gemini 3.1 Pro', whPer1k: 0.0030, pricePer1kIn: 0.00125, pricePer1kOut: 0.0050, family: 'Google' },
    { name: 'Gemini 3.1 Flash', whPer1k: 0.0007, pricePer1kIn: 0.000075, pricePer1kOut: 0.00030, family: 'Google' },
    { name: 'Gemini 2.5 Pro', whPer1k: 0.0025, pricePer1kIn: 0.00125, pricePer1kOut: 0.0050, family: 'Google' },

    // Meta
    { name: 'Llama 4 1T', whPer1k: 0.0100, pricePer1kIn: 0.0020, pricePer1kOut: 0.0020, family: 'Meta' },
    { name: 'Llama 4 400B', whPer1k: 0.0040, pricePer1kIn: 0.0006, pricePer1kOut: 0.0006, family: 'Meta' },
    { name: 'Llama 4 70B', whPer1k: 0.0012, pricePer1kIn: 0.0003, pricePer1kOut: 0.0003, family: 'Meta' },
    { name: 'Llama 4 8B', whPer1k: 0.0004, pricePer1kIn: 0.00005, pricePer1kOut: 0.00005, family: 'Meta' },

    // DeepSeek
    { name: 'DeepSeek V4', whPer1k: 0.0045, pricePer1kIn: 0.00014, pricePer1kOut: 0.00028, family: 'DeepSeek' },
    { name: 'DeepSeek R2', whPer1k: 0.0065, pricePer1kIn: 0.00055, pricePer1kOut: 0.00219, family: 'DeepSeek' },
];

export const CO2_PER_WH = 0.386; // gCO₂/Wh (US avg: 386 gCO₂/kWh)

export const EXAMPLES = [
    {
        label: "Neural Architecture Search",
        text: "Design a novel Transformer variant optimized for time-series forecasting. Detail the attention mechanism modifications, positional encoding strategy, and provide a PyTorch implementation outline. Explain how it improves upon the standard O(n^2) complexity."
    },
    {
        label: "Quantum Error Correction",
        text: "Explain the surface code for quantum error correction. How does it rely on topological properties to protect qubits, and what are the syndrome measurement cycles? Provide a visual mapping of data and measure qubits on a 2D lattice."
    },
    {
        label: "AGI Alignment Protocol",
        text: "Draft a comprehensive protocol for evaluating the alignment of a hypothetical Artificial General Intelligence (AGI). Address scalable oversight, deception detection, and interpretability techniques for billion-parameter models."
    },
    {
        label: "Dyson Sphere Roadmap",
        text: "Create a 500-year engineering roadmap for the construction of a Dyson Swarm around the Sun. Include material requirements (e.g., harvesting Mercury), orbital mechanics of the swarm, energy beaming strategies using microwaves, and the macroeconomic impacts on Earth."
    }
];
