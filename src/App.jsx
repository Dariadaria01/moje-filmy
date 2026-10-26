import { useState, useEffect, use } from "react";
import './App.css'


function App(){

const [filmy, setFilmy] = useState([])
const [szukanaFraza, setSzukanaFraza] = useState("")
const [kierunekSortowania, setKierunekSortowania] = useState("rosnaco")
const [wybranyGatunek, setWybranyGatunek] = useState("wszystkie")
const [czyLaduje, setCzyLaduje] = useState(true)
const [blad, setBlad] = useState(false)

const unikalneGatunki = [
  ...new Set(filmy.map((film) => film.gatunek))
];

 
const przefiltrowaneFilmy = filmy.filter((film) =>
  film.tytul.toLowerCase().includes(szukanaFraza.toLowerCase()) &&
(wybranyGatunek === "wszystkie" || film.gatunek === wybranyGatunek)
)
const posortowaneFilmy = [...przefiltrowaneFilmy].sort(
kierunekSortowania === "rosnaco"
? (a, b) => a.rok - b.rok
: (a, b) => b.rok - a.rok
)


  useEffect(() => {
fetch(`${import.meta.env.BASE_URL}dane.json`)
.then(response => {
if (!response.ok){
  throw new Error(`Błąd HTTP: ${response.status}`)
}
  return response.json()
})
.then((dane) => {
  setFilmy(dane)
  })
.catch((error) => {
  console.log("Błąd:", error.message) 
  setBlad(true)
})
.finally(() => {
  setCzyLaduje(false)
})
  }, [])

return (
  <div>
    <h1>Moje filmy</h1>

<input
type = "text"
value = {szukanaFraza}
onChange = {(e) => {
setSzukanaFraza(e.target.value)
}}
placeholder = "Szukaj filmu" 
/>
<select
value = {kierunekSortowania}
onChange={(e) => {
  setKierunekSortowania(e.target.value)
}}
>
  <option value="rosnaco">Od najstarszego</option>
  <option value="malejaco">Od najnowszego</option>
</select>




<select 
value = {wybranyGatunek}
onChange={(e) => {
  setWybranyGatunek(e.target.value)
}}
>
  <option value = "wszystkie">Wszystkie gatunki</option>

{unikalneGatunki.map((gatunek)=> (
  <option key = {gatunek} value = {gatunek}>
    {gatunek}
  </option>
))}

</select>

    <ul>
      {czyLaduje && <li>Ładowanie filmów...</li>}
       {!czyLaduje && blad && (
    <li>Nie udało się pobrać filmów.</li>
  )}

{!czyLaduje && !blad && posortowaneFilmy.length === 0 && (
  <li>Nie znaleziono filmów</li>
  )}
    {!czyLaduje && !blad && posortowaneFilmy.map((film) => (
<MovieCard film={film} key={film.id}/>
      ))}
  

   
    </ul>
  </div>
)

}

function MovieCard(props){
return (
  <li className="movie-card">
<h2>{props.film.tytul}</h2>
      <p>{props.film.rok}</p>

  </li>
)
}



export default App















