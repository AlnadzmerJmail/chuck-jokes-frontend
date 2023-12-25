export const initialJokes = {
	categories: [],
	randomJoke: {},
	categoryJoke: {},
	jokesList: [],
	count: 0,
	showPagination: false,
	shouldUpdateJoke: false,
	filterBy: '',
};

export const jokesReducer = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'CATEGORIES':
			return {
				...state,
				categories: payload,
			};

		case 'RANDOM':
			return {
				...state,
				randomJoke: state.randomJoke.value ? state.randomJoke : payload, // dev mode only -- to avoid updating ui twice during mounting
			};
		case 'CATEGORY':
			return {
				...state,
				categoryJoke: state.categoryJoke.value ? state.categoryJoke : payload,
			};
		case 'LIST':
			let list = [...state.jokesList];

			const newTextData = { page: payload.page, joke: payload.result };
			const listData = {
				total: payload.total,
				text: payload.text,
				data: [newTextData],
			};

			// list is empty at first
			const existingTextData = list.find(
				({ text = '' } = {}) => text === payload.text
			);

			if (existingTextData) {
				// dev environment
				if (!existingTextData.data.find(({ page }) => page === payload.page)) {
					existingTextData.data.push(newTextData);
				}
			} else {
				list.push(listData);
			}

			return {
				...state,
				jokesList: [...list],
			};
		case 'SHOW_PAGE':
			return {
				...state,
				showPagination: payload,
			};
		case 'SHOULD_UPDATE':
			return {
				...state,
				shouldUpdateJoke: payload,
			};

		case 'FILTER':
			return {
				...state,
				filterBy: payload,
			};

		default:
			return state;
	}
};
