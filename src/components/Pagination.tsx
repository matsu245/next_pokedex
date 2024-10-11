import React from 'react';

interface Props {
  perPage: number;
  offset: number;
  totalItems: number; // 総アイテム数
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  changeOffset: (num: number) => void;
}

export const Pagination: React.FC<Props> = ({ perPage, offset, totalItems, setOffset, changeOffset }) => {

  const nextPage = () => {
    const necessaryButtonCount = Math.ceil(totalItems / perPage);
    if (necessaryButtonCount === offset) return;
    setOffset((prevState) => {
      return prevState + 1;
    });
  };

  const prevPage = () => {
    if (offset === 1) return;
    setOffset((prevState) => {
      return prevState - 1;
    });
  };

  const getButtonCount = (totalLength: number, perPage: number): number[] => {
    const necessaryButtonCount = Math.ceil(totalLength / perPage);
    return Array.from({ length: necessaryButtonCount }, (_, i) => i + 1);
  };

  return (
    <div className="flex justify-center place-items-center gap-2 mt-8">
      <button className="w-2.5 h-2.5 rotate-45 border-l-[3px] border-l-[#ff6961] border-b-[3px] border-b-[#ff6961] border-solid mr-3" onClick={prevPage}></button>
      <div className="flex flex-wrap justify-center place-items-center gap-2">
        {getButtonCount(totalItems, perPage).map((count) => (
          <button
            key={count}
            className={`rounded-full border bg-white bg-gradient-to-b from-[#ff6961] from-50% to-white to-50% z-30 w-7 h-7 ml-1 flex justify-center items-center after:w-1.5 after:h-1.5 after:rounded-full after:bg-white after:absolute after:z-[-1] transition hover:scale-125`+
            `${count === offset ? ' scale-125' : ''}${count < offset-2 ? ' hidden md:flex' : ''}${count > offset+2 ? ' hidden md:flex' : ''}`}
            onClick={() => changeOffset(count)} // ページ番号を変更
          >
            {count}
          </button>
        ))}
      </div>
      <button className="w-2.5 h-2.5 rotate-45 border-r-[3px] border-r-[#ff6961] border-t-[3px] border-t-[#ff6961] border-solid ml-3" onClick={nextPage}></button>
    </div>
  );
};
