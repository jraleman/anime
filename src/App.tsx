import './App.css';
import AnimeCard from './components/AnimeCard';
import { useFetchData } from './hooks/useFetchData';
import { animeListEndpoint } from './utils/constants';

function App() {
    const { status, error, data } = useFetchData(animeListEndpoint);

    console.log({ status, error, data })
    return (
        <div className="App">
            <h1>Anime</h1>
            <div className="card">
                {/* TODO: Do mapping of data to render cards */}
                {data && (<AnimeCard data={data} />)}
            </div>
        </div>
    );
}

export default App
