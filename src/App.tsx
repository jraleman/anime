import './App.css'
import { useApi } from './hooks/useApi'

const url = 'http://127.0.0.1:5173/api/users/jraleman/animelist';

function App() {
  const { status, error, data } = useApi(url);

  console.log({ status, error, data })
  return (
    <div className="App">
      <h1>Anime</h1>
      <div className="card">
        <p className="read-the-docs">
          TBD
        </p>
        <div>
          <h2>{JSON.stringify(data)}</h2>
        </div>
      </div>
    </div>
  )
}

export default App
