'use client';
import Image from "next/image";
import { List } from '@/components/List';
import { Modal  } from '@/components/Modal';
import { usePageHook } from '@/app/page.hooks';
import { Pagination } from '@/components/Pagination';
import { SearchForm } from '@/components/SearchForm';

const perPage = 48;

export default function Home() {
  const {
    detailedPokemonList,
    filteredPokemonList,
    setFilteredPokemonList,
    paginatedPokemonList,
    setOffset,
    offset,
    changeOffset,
    isModalOpen,
    openModal,
    closeModal,
    selectedPokemon,
    setSelectedPokemon,
  } = usePageHook();



  const typecolor = (type: string) => {
    switch (type){
      case "かくとう":
        return "bg-[#e39b40]";
      case "ひこう":
        return "bg-[#a3c3e4]";
      case "どく":
        return "bg-[#725198]";
      case "じめん":
        return "bg-[#967949]";
      case "いわ":
        return "bg-[#c0b88a]";
      case "むし":
        return "bg-[#9fa33e]";
      case "ゴースト":
        return "bg-[#664970]";
      case "はがね":
        return "bg-[#68a9c6]";
      case "ほのお":
        return "bg-[#e86a41]";
      case "みず":
        return "bg-[#5285c6]";
      case "くさ":
        return "bg-[#68a945]";
      case "でんき":
        return "bg-[#f6d951]";
      case "エスパー":
        return "bg-[#df6b79]";
      case "こおり":
        return "bg-[#6bcce0]";
      case "ドラゴン":
        return "bg-[#515caa]";
      case "あく":
        return "bg-[#4d4948]";
      case "フェアリー":
        return "bg-[#d9b5d2]";
      case "ステラ":
        return "bg-gradient-to-r from-slate-400 via-slate-200 to-slate-300 to-80%";
      default:
        return "bg-[#949496]";
    }
  }

  return (
    <div className="max-w-screen-2xl m-[auto]">
      <SearchForm
        detailedPokemonList={detailedPokemonList}
        setFilteredPokemonList={setFilteredPokemonList}
        changeOffset={changeOffset}
      />

      { ( detailedPokemonList.length > 0 && paginatedPokemonList.length <= 0)   && (
          // ユーザーがいる場合に表示させるコンポーネント
          <p className='text-center my-20'>ポケモンが見つかりません。</p>
        )
      }

      <List 
        detailedPokemonList={detailedPokemonList}
        paginatedPokemonList={paginatedPokemonList}
        openModal={openModal}
        setSelectedPokemon={setSelectedPokemon}
      />

      {/* <Pagination perPage={perPage}  /> */}

      <Pagination
        perPage={perPage}
        totalItems={filteredPokemonList.length}
        offset={offset}
        setOffset={setOffset}
        changeOffset={changeOffset}
      />


      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <article className='grid place-content-center'>
          <p className='mb-2'><span className="mr-6">No.{selectedPokemon?.id.toString().padStart( 3, '0')}</span>
            {selectedPokemon?.types.map((type, index) => (
              <span key={index} className={`mr-1 px-2 py-1 text-white text-sm ${typecolor(type)}`}>
                {type}
              </span>
            ))}
          </p>
          { selectedPokemon?.image.artwork  && (
          <figure className='w-[clamp(calc(200px-3rem),380px,100%)] aspect-square m-[auto]'><Image src={selectedPokemon?.image.artwork} alt="" width={500} height={500} unoptimized/></figure>
            )
          }
          <h1 className='text-center font-bold text-2xl'>{selectedPokemon?.jaName}</h1>
          <p className='text-xs text-center mb-3 text-zinc-400'>{selectedPokemon?.roName}</p>
          <p className='mb-3 text-center'>{selectedPokemon?.jaGenus}</p>
          <p className='mb-2 w-fit mx-[auto] text-justify'>{selectedPokemon?.flavorText}</p>
        </article>
      </Modal>
    </div>
  );
}
