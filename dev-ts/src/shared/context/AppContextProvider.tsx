import { createContext, useState } from "react";

interface IAppContext {
  staff: string|null;
  period: {
    monthly: null;
    quarterly: null;
    annual: null;
  }
}

export const AppContext = createContext<any>(null);

export const AppContextProvider = (props: any) => {
  const [appContext, setAppContext] = useState<IAppContext|null>({
    staff: null, period: {
      monthly: null,
      quarterly: null,
      annual: null
    }
  });

  return (
    <AppContext.Provider value={[appContext, setAppContext]}>
      {props.children}
    </AppContext.Provider>
  );
}