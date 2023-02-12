import './App.css';
import { useFetchData } from './hooks/useFetchData';
import { animeListEndpoint } from './utils/constants';

function App() {
  const { status, error, data } = useFetchData(animeListEndpoint);

  console.log({ status, error, data })
  return (
    <div className="App">
      <h1>Anime</h1>
      <div className="card">
        <p className="read-the-docs">
          {JSON.stringify(data)}
        </p>
      </div>
    </div>
  )
}

export default App
