import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [pokemon, setPokemon] = useState<any>(null);
  const [pokemonNotFound, setPokemonNotFound] = useState<boolean>(false);

  const fetchPokemon = async (endpoint: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${endpoint}`);

      if (!response.ok) {
        setPokemon(null);
        setPokemonNotFound(true); 
        return;
      }

      const data = await response.json();
      setPokemon(data);
      setPokemonNotFound(false); 
    } catch (error) {
      console.error('Erro na requisição:', error);
      setPokemon(null);
      setPokemonNotFound(true);
    }
  };

  const handleNameSearch = async () => {
    if (name) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

        if (!response.ok) {
          setPokemon(null);
          setPokemonNotFound(true); 
          return;
        }

        const data = await response.json();
        setPokemon(data);
        setPokemonNotFound(false); 
      } catch (error) {
        console.error('Erro ao buscar Pokémon por nome:', error);
        setPokemon(null);
        setPokemonNotFound(true);
      }
    }
  };

  const handleTypeSearch = async () => {
    if (type) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
        const data = await response.json();

        if (data && data.pokemon && data.pokemon.length > 0) {
          const randomPokemon = data.pokemon[Math.floor(Math.random() * data.pokemon.length)].pokemon;
          const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon.name}`);
          const pokemonData = await pokemonResponse.json();
          setPokemon(pokemonData);
          setPokemonNotFound(false); 
        } else {
          console.error('Nenhum Pokémon encontrado para o tipo especificado.');
          setPokemon(null);
          setPokemonNotFound(true); 
        }
      } catch (error) {
        console.error('Erro ao buscar Pokémon por tipo:', error);
        setPokemon(null);
        setPokemonNotFound(true);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokémon API</h1>

      <div className="flex flex-col md:flex-row mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome do Pokémon"
          className="input mb-2 md:mb-0 md:mr-2"
        />
        <button onClick={handleNameSearch} className="button">
          Buscar por Nome
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Digite o tipo do Pokémon"
          className="input mb-2 md:mb-0 md:mr-2"
        />
        <button onClick={handleTypeSearch} className="button">
          Buscar por Tipo
        </button>
      </div>

      {pokemonNotFound && (
        <p className="error-message text-red-500 mt-2">Pokémon não encontrado!</p>
      )}

      {pokemon && (
        <div className="pokemon-info mt-4">
          <h2 className="pokemon-name text-xl font-bold mb-2">{pokemon.name}</h2>
          <p className="pokemon-id">ID: {pokemon.id}</p>
          <p className="pokemon-types">Tipo: {pokemon.types.map((t: any) => t.type.name).join(', ')}</p>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image mt-2 rounded-md shadow-md" />
        </div>
      )}

      

    </div>
  );
};

export default App;
