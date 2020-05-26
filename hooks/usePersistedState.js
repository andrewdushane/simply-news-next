import { useCallback, useEffect, useState } from "react";
import localforage from "localforage";

const defaultIsValid = (persistedValue) => !!persistedValue;

const usePersistedState = (
  storageKey,
  defaultValue,
  isValidValue = defaultIsValid
) => {
  const [value, setValue] = useState(defaultValue);
  const [initialized, setInitalized] = useState(false);
  useEffect(() => {
    localforage.getItem(storageKey, (err, persistedValue) => {
      if (isValidValue(persistedValue)) {
        setValue(JSON.parse(persistedValue));
      }
      setInitalized(true);
    });
  }, []);
  useEffect(() => {
    if (initialized) {
      localforage.setItem(storageKey, JSON.stringify(value));
    }
  }, [value, initialized]);
  return [value, setValue, initialized];
};

export default usePersistedState;
