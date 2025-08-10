import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [jokes, setJokes] = useState([])
  useEffect(()=>{
    axios.get('api/jokes')
    .then(respone=>{
      console.log(respone.data)
      setJokes(respone.data)  
    })
    .catch(error=>{
      console.log(error)
    })  

  },[])
  
  return (
    <>
      <h1>Jokes: {jokes.length}</h1>   
     {
      jokes.map((joke, index)=>(
        <div key={index}>
          <h2>{joke.title}</h2>
          <p>{joke.content}</p>
        </div>
      ))
     }
    </>
  )
}

export default App
