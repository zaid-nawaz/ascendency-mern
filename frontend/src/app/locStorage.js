
export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
    } catch (e) {
      console.warn("Could not save state", e);
    }
  };
  
 

export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined; // Return undefined if no saved state
      }
      return JSON.parse(serializedState);
    } catch (e) {
      console.warn("Could not load state", e);
      return undefined;
    }
  };
  