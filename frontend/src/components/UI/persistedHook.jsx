import { useState, useEffect } from 'react';

function usePersistedUserState(key, initialValue) {
 // Retrieve the initial state from localStorage or use the provided initial value
    const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // console.log('Stored value on load:', storedValue); // Log the initial load
    return storedValue ? JSON.parse(storedValue) : initialValue;
    });

useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default usePersistedUserState;