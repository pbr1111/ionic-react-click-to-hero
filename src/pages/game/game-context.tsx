import React, {
    Context,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useReducer
} from 'react';
import { useLevelContext, useLevelContextActions } from '../../contexts/level-context';
import { generateDifficultyLevelSeconds } from '../../utils/level-generator';
import { GameContextReducer } from './game-context/game-context-reducer';

export type GameContextState = {
    clicks: number;
    seconds: number;
    state: 'running' | 'ended';
};

type GameContextActionsState = {
    startGame: () => void;
    addClicks: (numClicks: number) => void;
    goToNextLevel: () => void;
    restartCurrentGame: () => void;
    endGame: () => void;
};

const GameContext = createContext<Partial<GameContextState>>({}) as Context<GameContextState>;
const GameContextActions = createContext<Partial<GameContextActionsState>>({}) as Context<
    GameContextActionsState
>;

type GameProviderProps = PropsWithChildren<{}>;

export const initialState: GameContextState = {
    clicks: 0,
    seconds: 0,
    state: 'running'
};

const GameProvider: React.FC<GameProviderProps> = ({ children }: GameProviderProps) => {
    const { level } = useLevelContext();
    const { nextLevel } = useLevelContextActions();
    const [state, dispatch] = useReducer(GameContextReducer, initialState);

    useEffect(() => {
        const seconds = generateDifficultyLevelSeconds(level);
        dispatch({ type: 'START_GAME', seconds });
    }, [level]);

    const startGame = useCallback(() => {
        const seconds = generateDifficultyLevelSeconds(level);
        dispatch({ type: 'START_GAME', seconds });
    }, [level]);

    const addClicks = useCallback((numClicks: number) => {
        dispatch({ type: 'ADD_CLICKS', value: numClicks });
    }, []);

    const goToNextLevel = useCallback(() => {
        nextLevel();
    }, [nextLevel]);

    const restartCurrentGame = useCallback(() => {
        dispatch({ type: 'RESTART_GAME' });
    }, []);

    const endGame = useCallback(() => {
        dispatch({ type: 'END_GAME' });
    }, []);

    return (
        <GameContextActions.Provider
            value={{
                startGame,
                addClicks,
                goToNextLevel,
                restartCurrentGame,
                endGame
            }}>
            <GameContext.Provider value={state}>{children}</GameContext.Provider>
        </GameContextActions.Provider>
    );
};

const useGameContext = () => useContext(GameContext);
const useGameContextActions = () => useContext(GameContextActions);

export { useGameContext, useGameContextActions, GameProvider };
