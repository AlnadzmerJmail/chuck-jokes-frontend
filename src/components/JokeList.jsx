import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { JokesContext } from '../context';

import useJokes from '../custom';

function JokeList() {
	const navigate = useNavigate();
	const { search } = useLocation();

	const {
		jokes: {
			randomJoke,
			categoryJoke,
			jokesList,
			showPagination,
			shouldUpdateJoke,
			filterBy,
		},
		setJokes,
	} = useContext(JokesContext);

	const { searchJokesHandler, queryValues } = useJokes({
		search,
	});
	const [queryValue, currentPage] = queryValues;

	const [joke, setJoke] = useState(null);
	const [listTotal, setListTotal] = useState(0);

	useEffect(() => {
		searchJokesHandler();
	}, []);

	useEffect(() => {
		const handleMouseScroll = (event) => {
			// deltaY is a property of the wheel event that indicates the scroll direction
			const scrollDirection = event.deltaY > 0 ? 'next' : 'prev';

			if (showPagination && filterBy !== 'category' && +currentPage > 0)
				pageHandler(scrollDirection);
		};

		window.addEventListener('wheel', handleMouseScroll);

		return () => window.removeEventListener('wheel', handleMouseScroll);
	}, [showPagination, filterBy, currentPage]);

	useEffect(() => {
		// WHY NEED SHOULD UPDATE??? -- to avoid updating when user clears the search bar
		if (shouldUpdateJoke) {
			if (!search) {
				if (randomJoke.value) {
					setJoke({
						...randomJoke,
						created_at: formatDate(randomJoke.created_at),
					});
				} else {
					searchJokesHandler();
				}
			}

			if (search) {
				if (search.includes('category')) {
					setJoke(
						categoryJoke?.value
							? {
									...categoryJoke,
									created_at: formatDate(categoryJoke.created_at),
							  }
							: null
					);
				} else {
					// FIND JOKE IN THE LIST
					const listData = jokesList.find(
						({ text }) => text === queryValues[0]
					);

					const joke = listData?.data?.find(
						({ page }) => page === +queryValues[1]
					)?.joke;

					if (joke) {
						setJoke({
							...joke,
							created_at: formatDate(joke.created_at),
						});
					} else {
						// triggered when user navigate the pagination
						searchJokesHandler();
					}

					setListTotal(listData?.total || 0);
				}
			}

			setJokes({
				type: 'SHOULD_UPDATE',
				payload: false,
			});
		}
	}, [
		currentPage,
		search,
		jokesList,
		randomJoke,
		categoryJoke,
		shouldUpdateJoke,
	]);

	const formatDate = (date) => {
		const originalDate = new Date(date);

		const formattedDate = originalDate.toLocaleString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});

		return formattedDate;
	};

	const pageHandler = (e) => {
		const elClicked = typeof e === 'string' ? e : e.target.id;

		setJokes({
			type: 'SHOULD_UPDATE',
			payload: true,
		});

		let page = 0;

		if (elClicked === 'prev') {
			if (currentPage <= 1) return;
			page = currentPage - 1;
		} else {
			if (currentPage >= listTotal) return;
			page = +currentPage + 1;
		}

		navigate(`/jokes?query=${queryValue}&page=${page}`);
	};
	return (
		<section>
			{joke ? (
				<div className="border rounded-md p-5 mb-5">
					<span>{joke.created_at || '--'}</span>
					<p>{joke.value || '--'}</p>
					<p className="text-right mt-3">Page {currentPage}</p>
				</div>
			) : (
				<p>No Joke!</p>
			)}
			{showPagination && filterBy !== 'category' && (
				<div
					onClick={pageHandler}
					className="flex justify-center md:justify-start items-center"
				>
					<button
						className="prev bg-transparent"
						disabled={+queryValues[1] < 2}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
							id="prev"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
							/>
						</svg>
					</button>{' '}
					<span>
						{queryValues[1]} of {listTotal}
					</span>{' '}
					<button
						className="next bg-transparent"
						disabled={+queryValues[1] === listTotal}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-6 h-6"
							id="next"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
							/>
						</svg>
					</button>
				</div>
			)}
		</section>
	);
}

export default JokeList;
