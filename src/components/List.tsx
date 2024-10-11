import Image from "next/image";
import { Pokemon } from '@/types/Pokemon';

type Props = {
  detailedPokemonList: Pokemon[];
  paginatedPokemonList: Pokemon[];
  openModal: () => void;
  setSelectedPokemon: (pokemon: Pokemon) => void;
};

export const List: React.FC<Props> = ({ detailedPokemonList, paginatedPokemonList, openModal, setSelectedPokemon }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">

      {detailedPokemonList.length === 0 ? ( // データがない場合の処理
        // プレースホルダーを表示
        Array.from({ length: 48 }).map((_, index) => ( // 48個の枠を表示
          <div key={index} className='p-3 rounded-xl min-h-[120px] bg-white bg-opacity-75 break-all grid content-start justify-items-center'>
          </div>
        ))
      ) : (
        // データが存在する場合の表示
        paginatedPokemonList.map((result) => {
          return (
            <div key={result.name}
              className='p-3 rounded-xl min-h-[120px] bg-white bg-opacity-75 break-all grid content-start justify-items-center cursor-pointer transition hover:shadow-md'
              onClick = {() => {
                openModal();
                setSelectedPokemon(result);
              }}
            >
              { result.image.thumb  && (
                <figure><Image src={result.image.thumb} alt="" width={96} height={96}/></figure>
                )
              }
              <p>{result.jaName}</p>
            </div>
          );
        })
      )}
    </div>
  );
};
