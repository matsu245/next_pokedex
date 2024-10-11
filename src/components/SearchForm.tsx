import { useState, useEffect, useMemo } from 'react';
import { Pokemon } from '@/types/Pokemon';

interface Props {
  detailedPokemonList: Pokemon[]; // 全てのポケモン詳細データ
  setFilteredPokemonList: React.Dispatch<React.SetStateAction<Pokemon[]>>; // フィルタリング結果を更新する関数
  changeOffset: (num: number) => void;
}

export const SearchForm: React.FC<Props> = ({
  detailedPokemonList,
  setFilteredPokemonList,
  changeOffset,
}) => {

  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = useMemo(() => {
    if (searchTerm.trim() === '') {
      return detailedPokemonList; // 検索ワードが空のときは全リストを返す
    }
    return detailedPokemonList.filter((item) =>
      [item.name, item.jaName, item.roName, item.jaGenus, ...item.types, item.flavorText].some((field) =>
        field.includes(searchTerm)
      )
    );
  }, [searchTerm, detailedPokemonList]);

  useEffect(() => {
    changeOffset(1); // 検索したらページネーションをリセット
  }, [searchTerm, changeOffset]);

  useEffect(() => {
    setFilteredPokemonList(filteredList); // フィルタされたリストを更新
  }, [filteredList, setFilteredPokemonList]);

  return (
    <div className='mb-8 flex items-center justify-center'>
      <input
        type="text"
        placeholder="キーワードで検索"
        className='px-2 py-1'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button 
        onClick = {() => {setSearchTerm('')}}
        className='ml-2 w-6 h-6 grid place-items-center leading-none rounded-md  text-zinc-600'
      >
        &times;</button>
    </div>
  );
};
