"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export interface ClassContextValue {
  classId?: string;
  className?: string;
  classLevel?: string;

  setClass: (
    data: {
      id: string;
      name: string;
      level: string;
    } | null,
  ) => void;
}

const ClassContext = createContext<ClassContextValue>({
  setClass: () => {},
});

export function ClassProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    id?: string;
    name?: string;
    level?: string;
  }>({});

  const setClass = useCallback(
    (
      data: {
        id: string;
        name: string;
        level: string;
      } | null,
    ) => {
      setState((prev) => {
        if (!data) {
          if (!prev.id) return prev;

          return {};
        }

        if (
          prev.id === data.id &&
          prev.name === data.name &&
          prev.level === data.level
        ) {
          return prev;
        }

        return data;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      classId: state.id,
      className: state.name,
      classLevel: state.level,
      setClass,
    }),
    [state, setClass],
  );

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
}

export function useClassContext() {
  return useContext(ClassContext);
}
