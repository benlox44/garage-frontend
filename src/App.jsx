import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TailwindTest from './components/TailwindTest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img 
            src={viteLogo} 
            className="h-24 w-24 hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" 
            alt="Vite logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img 
            src={reactLogo} 
            className="h-24 w-24 animate-spin hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" 
            alt="React logo" 
          />
        </a>
      </div>
      
      <h1 className="text-6xl font-bold text-gray-800 mb-8 text-center">
        Vite + React
      </h1>
      
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100 max-w-md">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-4 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          count is {count}
        </button>
        <p className="text-gray-600 text-center text-sm">
          Edit <code className="bg-gray-200 px-2 py-1 rounded text-xs">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-gray-500 mt-8 text-center max-w-md">
        Click on the Vite and React logos to learn more
      </p>
      
      <div className="mt-8">
        <TailwindTest />
      </div>
    </div>
  )
}

export default App
