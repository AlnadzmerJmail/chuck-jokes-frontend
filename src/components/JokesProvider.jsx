import React, { useReducer } from 'react';

import { initialJokes, jokesReducer } from '../reducer';

import { JokesContextProvider } from '../context';

export default function JokesProvider({ children }) {
	const [jokes, setJokes] = useReducer(jokesReducer, initialJokes);

	return (
		<JokesContextProvider value={{ jokes, setJokes }}>
			{children}
		</JokesContextProvider>
	);
}
