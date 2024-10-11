import { useEffect, useState, useCallback } from 'react';
import { Pokemon } from '@/types/Pokemon';
import { PokemonType } from '@/types/PokemonType';
import { Sprites } from '@/types/Sprites';
const baseUrl = 'https://pokeapi.co/api/v2/';
const pokeApiUrl = baseUrl + 'pokemon?limit=100000&offset=0';
const perPage = 48;

interface Name {
  language: {
    name: string;
  };
  name: string;
}
interface Genus {
  language: {
    name: string;
  };
  genus: string;
}
interface flavorText {
  language: {
    name: string;
  };
  flavor_text: string;
}
interface Species {
  names: Name[];
  genera: Genus[];
  flavor_text_entries: flavorText[];
}

export const usePageHook = () => {
  const [offset, setOffset] = useState<number>(1);
  const [initialPokemonList, setInitialPokemonList] = useState<Pokemon[]>([]); // pokeApiUrl でとれる一覧のみ。 { name, url }
  const [detailedPokemonList, setDetailedPokemonList] = useState<Pokemon[]>([]); // initialPokemonList に詳細データを追加した配列
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]); // detailedPokemonList を条件でfilterした配列
  const [paginatedPokemonList, setPaginatedPokemonList] = useState<Pokemon[]>([]); // filteredPokemonList から現在のページの1ページ分を切り抜いた配列
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]); // ポケモンタイプの一覧
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>(); // モーダルに表示するポケモン
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const fetchInitialPokemon = async (): Promise<Pokemon[]> => {
    const res = await fetch(pokeApiUrl);
    const data = await res.json();

    const pokemon = data.results
      .map((result: { name: string; url: string }): Pokemon | null => {
        const idMatch = result.url.match(/\/pokemon\/(\d+)\//);
        const id = idMatch ? parseInt(idMatch[1]) : null;

        // ハイフンが含まれていない場合のみポケモンオブジェクトを作成
        if (!result.name.includes('-') && id !== null) {
          return {
            id,
            name: result.name,
            url: result.url,
            jaName: '',
            roName: '',
            jaGenus: '',
            image: { thumb: '', artwork: '' },
            types: [],
            flavorText: '',
          } as Pokemon;
        }
        return null; // ハイフンが含まれている場合はnullを返す
      })
      .filter((pokemon: Pokemon): pokemon is Pokemon => pokemon !== null); // nullを除外

    return pokemon;
  };

  
  const fetchPokemonDetails = useCallback(async (result: Pokemon): Promise<Pokemon> => {
    const response1 = await fetch(result.url);
    if (!response1.ok) {
      throw new Error(`Error fetching data: ${response1.statusText}`);
    }
    const data1: Sprites = await response1.json();
    const thumb = data1.sprites.front_default;
    const artwork = data1.sprites.other['official-artwork'].front_default;
    const speciesUrl = data1.species.url;
  
    let types: string[] = [];
    for (let i = 0; i < data1.types.length; i++) {
      const typeName = data1.types[i].type.name;
      const typeObject = pokemonTypes.find((t) => t.name == typeName);
      if (typeObject) {
        types = [...types, typeObject.jaName];
      }
    }
  
    let jaName = '???', roName = '???', jaGenus = '???', flavorText = '???';
    if (speciesUrl) {
      const response2 = await fetch(speciesUrl);
      if (response2.ok) {
        const data2: Species = await response2.json();
        jaName = data2.names.find((name) => name.language.name === 'ja')?.name || '???';
        roName = data2.names.find((name) => name.language.name === 'roomaji')?.name || '???';
        jaGenus = data2.genera.find((genus) => genus.language.name === 'ja')?.genus || '???';
        flavorText = data2.flavor_text_entries.find((flavor_text) => flavor_text.language.name === 'ja')?.flavor_text || '???';
      }
    }
  
    const post: Pokemon = {
      ...result,
      jaName: jaName,
      roName: roName,
      jaGenus: jaGenus,
      image: {
        thumb: thumb,
        artwork: artwork,
      },
      types: types,
      flavorText: flavorText,
    };
  
    return post;
  }, [pokemonTypes]);



  const fetchAllPokemonTypes = async () => {
    const response = await fetch(`${baseUrl}type`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon types');
    }
    return await response.json();
  };


  type PokemonTypeResult = {
    name: string;
    url: string;
  };
  
  type PokemonTypeDetails = {
    name: string;
    names: { language: { name: string }; name: string }[];
  };
  
  const fetchPokemonTypes = useCallback(async () => {
    try {
      const typeData: { results: PokemonTypeResult[] } = await fetchAllPokemonTypes();
      const types = await Promise.all(
        typeData.results.map(async (type: PokemonTypeResult) => {
          const response = await fetch(type.url);
          if (response.ok) {
            const data: PokemonTypeDetails = await response.json();
            const jaName =
              data.names.find(
                (name: { language: { name: string }; name: string }) => name.language.name === 'ja'
              )?.name || '???';
            return { name: data.name, jaName };
          }
          return null;
        })
      );
      return types.filter((type) => type !== null);
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);


  const getPokemonWithDetails = useCallback(async (result: Pokemon): Promise<Pokemon> => {
    let post;
    const index = detailedPokemonList.findIndex(({ name }) => name === result.name);
    
    if (index === -1) {
      post = await fetchPokemonDetails(result);
    } else {
      if (!detailedPokemonList[index].jaName) {
        post = await fetchPokemonDetails(result);
      } else {
        post = detailedPokemonList[index];
      }
    }
    
    return post;
  }, [detailedPokemonList, fetchPokemonDetails]);


  // const nextPage = () => {
  //   const necessaryButtonCount = Math.ceil(initialPokemonList.length / perPage);
  //   if (necessaryButtonCount === offset) return;
  //   setOffset((prevState) => prevState + 1);
  // };

  // const prevPage = () => {
  //   if (offset === 1) return;
  //   setOffset((prevState) => prevState - 1);
  // };

  const changeOffset = useCallback((num: number) => {
    setOffset(num);
  }, []);

  const getPaginatedPokemonList = useCallback(async (
    results: Pokemon[],
    offset: number,
    perPage: number
  ): Promise<Pokemon[]> => {
    const paginatedPokemonList = results.slice((offset - 1) * perPage, offset * perPage);
  
    // Promise.allを使って並列にgetPokemonWithDetailsを呼び出す
    const newResults = await Promise.all(
      paginatedPokemonList.map((result) => getPokemonWithDetails(result))
    );
    return newResults;
  }, [getPokemonWithDetails]);


  useEffect(() => {
    fetchPokemonTypes().then((data) => setPokemonTypes(data));
  }, [fetchPokemonTypes]);

  
  useEffect(() => {
    if (pokemonTypes.length > 0 && initialPokemonList.length === 0 ) {
      fetchInitialPokemon().then((data) => setInitialPokemonList(data));
      // setFilteredPokemonList(initialPokemonList);
    }
  }, [pokemonTypes, initialPokemonList]);



  useEffect(() => {
    const fetchAllDetails = async () => {
      const totalBatches = Math.ceil(initialPokemonList.length / perPage); // バッチ数を計算
      for (let i = 0; i < totalBatches; i++) {
        const start = i * perPage; // 現在のバッチの開始インデックス
        const end = start + perPage; // 現在のバッチの終了インデックス
        const pokemonBatch = initialPokemonList.slice(start, end); // 現在のバッチを取得
        const promises = pokemonBatch.map((pokemon) => fetchPokemonDetails(pokemon)); // Promiseの配列を作成
        try {
          const detailedData = await Promise.all(promises); // 現在のバッチを並行して取得
          setDetailedPokemonList((prevState) => {
            // 現在の状態と新しく取得したデータを結合し、重複を排除する
            const updatedList = [...prevState, ...detailedData];
            const uniqueList = Array.from(new Set(updatedList.map(p => p.id))) // 'id'を使って重複を削除
              .map(id => updatedList.find(p => p.id === id))
              .filter((p): p is Pokemon => p !== undefined); // undefinedを除外
            return uniqueList; // 重複のないデータを返す
          });
        } catch (error) {
          console.error('Failed to fetch Pokémon details:', error);
        }
      }
    };
    if (initialPokemonList.length > 0) {
      fetchAllDetails(); // ポケモンリストが存在すれば実行
    }
  }, [initialPokemonList, fetchPokemonDetails]);

  

  useEffect(() => {
    getPaginatedPokemonList(filteredPokemonList, offset, perPage).then((data) =>
      setPaginatedPokemonList(data)
    );
  }, [offset, filteredPokemonList, getPaginatedPokemonList]);
  

  return {
    totalPages: Math.ceil(initialPokemonList.length / perPage),
    // prevPage,
    // nextPage,
    offset,
    changeOffset,
    setOffset,
    initialPokemonList,
    detailedPokemonList,
    filteredPokemonList,
    setFilteredPokemonList,
    paginatedPokemonList,
    pokemonTypes,
    isModalOpen,
    openModal,
    closeModal,
    selectedPokemon,
    setSelectedPokemon,
  };
};
