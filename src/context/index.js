import React, { createContext } from 'react';
// import { initialJokes } from '../reducer';

export const JokesContext = createContext();

const JokesContextProvider = JokesContext.Provider;

export { JokesContextProvider };
