/**
 * Enum describing the various states the game can have in human mode.
 */
export enum HumanModeState {
    // Initial state
    Inactive,
    // Currently initializing (coloured line will be displayed)
    InitializationPhase,
    // Marble has started
    Launched,
    // Marble has stopped
    Stopped
}

/**
 * Enum describing the various states the game can have in ai mode.
 */
export enum AIModeState {
    // Initial state
    Inactive,
    // Marbles have launched, iteration is in progress
    Launched,
    // Marbles have stopped, new iteration can start
    NewIterationReady
}