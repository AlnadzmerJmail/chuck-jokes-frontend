import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { JokesContext } from '../context';

import useJokes from '../custom';

const API = import.meta.env.VITE_BACKEND_API;

function SearchBy() {
	const navigate = useNavigate();
	const { search } = useLocation();

	const {
		jokes: { categories, filterBy },
		setJokes,
	} = useContext(JokesContext);
	const { searchJokesHandler, categoryValue } = useJokes({ search });

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(`${API}/categories`);

				const categories = await response.json();
				if (categories.error) throw new Error(categories.error);

				setJokes({ type: 'CATEGORIES', payload: categories });
			} catch (error) {
				alert(error);
			}
		};

		setJokes({
			type: 'FILTER',
			payload: categoryValue ? 'category' : 'free text',
		});

		fetchCategories();
	}, []);

	const categoryHanler = (e) => {
		const { value } = e.target;

		navigate(value ? `/jokes?category=${value.toLowerCase()}` : '/');
	};

	const freeTextHandler = (e) => {
		const { value } = e.target;
		navigate(value ? `/jokes?query=${value.toLowerCase()}` : '/');

		if (!value) {
			setJokes({
				type: 'SHOW_PAGE',
				payload: false,
			});
			setJokes({
				type: 'SHOULD_UPDATE',
				payload: true,
			});
		}
	};

	const searchByClickHandler = (e) => {
		setJokes({
			type: 'FILTER',
			payload: e.target.textContent.toLowerCase(),
		});
	};

	const searchClickHandler = () => {
		search && searchJokesHandler();
	};
	return (
		<section className="mb-5">
			<div
				onClick={searchByClickHandler}
				className="inline-block px-2 bg-slate-400 mb-10"
			>
				<span
					className={`search-category inline-block mr-5 pb-1 ${
						filterBy === 'category' ? 'border-b-[3px] border-blue-600' : ''
					}`}
				>
					Category
				</span>
				<span
					className={`search-category inline-block pb-1 ${
						filterBy !== 'category' ? 'border-b-[3px] border-blue-600' : ''
					}`}
				>
					Free Text
				</span>
			</div>
			<div className="w-full flex flex-wrap justify-between items-center gap-4 md:gap-0 mb-10">
				<span className="capitalize w-full md:w-[12%] inline-block">
					{filterBy} :
				</span>
				<span className="inline-block w-full md:w-[63%] border-slate-400 border rounded-md px-2 py-2">
					{filterBy === 'category' ? (
						<select
							className="w-full bg-transparent text-blue-400 capitalize"
							name="category"
							value={
								search && !search.includes('query') ? search.substring(10) : ''
							}
							onChange={categoryHanler}
						>
							<option className="capitalize">Select Category</option>
							{categories?.map((category) => (
								<option key={category} className="capitalize">
									{category}
								</option>
							))}
						</select>
					) : (
						<input
							name="free_text"
							type="text"
							value={
								search && search.includes('query') ? search.substring(7) : ''
							}
							placeholder="Enter text"
							className="w-full bg-transparent text-blue-400 capitalize"
							onChange={freeTextHandler}
						/>
					)}
				</span>
				<button
					className="inline-block w-full md:w-[20%] bg-blue-400"
					onClick={searchClickHandler}
				>
					Search
				</button>
			</div>
		</section>
	);
}
export default SearchBy;
