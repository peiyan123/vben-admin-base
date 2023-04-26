import { InjectionKey } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import { Emitter } from '/@/utils/mitt';

type contextProps = {
  playerEmitter: Emitter;
};
const key: InjectionKey<contextProps> = Symbol();

export function createPlayerContext(context: contextProps) {
  return createContext<contextProps>(context, key);
}

export function usePlayerContext() {
  return useContext<contextProps>(key);
}
