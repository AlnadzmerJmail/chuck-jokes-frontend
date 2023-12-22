import { useContext } from 'react';

import { JokesContext } from '../context';

const API = import.meta.env.VITE_BACKEND_API;

function useJokes({ search }) {
	const { jokes, setJokes } = useContext(JokesContext);

	const categoryValue = search?.includes('category')
		? search.substring(10)
		: '';
	const queryValue = search?.includes('query') ? search.substring(7) : '';

	const fetchJokes = async (urlPart) => {
		try {
			// BY DEFAULT FETCHES RANDOM
			const response = await fetch(`${API}/${urlPart}`);

			const jokes = await response.json();

			if (jokes.error) throw new Error(jokes.error);

			setJokes({
				type: 'SHOW_PAGE',
				payload: jokes?.result?.length || false, // false on random or category
			});

			setJokes({
				type: 'SHOULD_UPDATE',
				payload: true,
			});

			// FREE TEXT SEARCH
			if (jokes?.result?.length) {
				setJokes({
					type: 'LIST',
					payload: { ...jokes, text: search.substring(7) },
				});
			} else {
				// CATEGORY
				if (jokes?.categories.length) {
					return setJokes({
						type: 'CATEGORY',
						payload: jokes,
					});
				}

				// RANDOM
				setJokes({ type: 'RANDOM', payload: jokes });
			}
		} catch (err) {
			alert(err);
		}
	};

	const searchJokesHandler = async (e) => {
		let urlPart = '';

		if (search) {
			// search by free text
			if (search.includes('query')) {
				if (queryValue) {
					// FIND EXISTING TEXT
					const existingJoke = jokes?.jokesList.find(
						({ text }) => text === queryValue
					);

					if (existingJoke) {
						// STOP HERE
						setJokes({
							type: 'SHOULD_UPDATE',
							payload: true,
						});

						return setJokes({
							type: 'SHOW_PAGE',
							payload: true,
						});
					}

					urlPart = `free_text/${queryValue}`;
				}
			} else urlPart = categoryValue || '';
		}

		// BY DEFAULT FETCHES RANDOM
		fetchJokes(`jokes/${urlPart || 'random'}`);
	};

	return {
		fetchJokes,
		searchJokesHandler,
		categoryValue,
		queryValue,
	};
}

export default useJokes;
