import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
        <div className="flex justify-center space-x-4 mb-6">
          <img src={viteLogo} className="h-16 w-16 hover:animate-spin transition-all duration-300" alt="Vite logo" />
          <img src={reactLogo} className="h-16 w-16 hover:animate-spin transition-all duration-300" alt="React logo" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">¡Garage Frontend!</h1>
        <p className="text-gray-600 mb-6">Aplicación React + Vite con Tailwind CSS</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105"
          >
            Contador: {count}
          </button>
          
          <div className="text-sm text-gray-500">
            <p>Tecnologías: React 19 + Vite + Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
