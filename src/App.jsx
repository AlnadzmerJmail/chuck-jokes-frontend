import './App.css';

// components
import JokesProvider from './components/JokesProvider';
import SearchBy from './components/SearchBy';
import JokeList from './components/JokeList';

function App() {
	return (
		<main className="w-full md:w-[85%] lg:w-[50%] m-auto p-10 px-15">
			<h1 className="text-center mb-10 text-3xl md:text-5xl">
				Chuck Norris Jokes
			</h1>
			<JokesProvider>
				<SearchBy />
				<JokeList />
			</JokesProvider>
		</main>
	);
}

export default App;
