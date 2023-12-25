import { useContext } from 'react';

import { JokesContext } from '../context';

const API = import.meta.env.VITE_BACKEND_API;

function useJokes({ search }) {
	const { jokes, setJokes } = useContext(JokesContext);

	const categoryValue = search?.includes('category')
		? search.substring(10)
		: '';

	// GET QUERY VALUE AND PAGE
	let queryValues = search.includes('query') ? search.split('&') : [];
	queryValues = [
		queryValues[0]?.substring(7) || '',
		queryValues[1]?.substring(5) || 1,
	];

	const fetchJokes = async (urlPart) => {
		try {
			// BY DEFAULT FETCHES RANDOM
			const response = await fetch(`${API}/${urlPart}`);

			const jokes = await response.json();

			if (jokes.error) throw new Error(jokes.error);

			setJokes({
				type: 'SHOW_PAGE',
				payload: jokes?.result?.id ? true : false, // false on random or category
			});

			setJokes({
				type: 'SHOULD_UPDATE',
				payload: true,
			});

			// FREE TEXT SEARCH
			if (jokes?.result) {
				if (!jokes.result.id) return alert('No joke found!');

				setJokes({
					type: 'LIST',
					payload: { ...jokes, text: queryValues[0], page: +queryValues[1] },
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
			if (queryValues[0]) {
				// FIND EXISTING TEXT
				const existingJoke = jokes?.jokesList
					.find(({ text }) => text === queryValues[0])
					?.data?.find(({ page }) => page === +queryValues[1])?.joke;

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

				urlPart = `free_text/?query=${queryValues[0]}&page=${queryValues[1]}`;
			} else urlPart = categoryValue || '';
		}

		// BY DEFAULT FETCHES RANDOM
		fetchJokes(`jokes/${urlPart || 'random'}`);
	};

	return {
		fetchJokes,
		searchJokesHandler,
		categoryValue,
		queryValues,
	};
}

export default useJokes;
