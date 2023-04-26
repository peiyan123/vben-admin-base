import { InjectionKey } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';
import { Emitter } from '/@/utils/mitt';

type contextProps = {
  drawEmitter: Emitter;
};
const key: InjectionKey<contextProps> = Symbol();

export function createTrainContext(context: contextProps) {
  return createContext<contextProps>(context, key);
}

export function useTrainContext() {
  return useContext<contextProps>(key);
}
