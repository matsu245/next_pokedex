import Link from 'next/link';

export const Header = () => {
  return (
    <header className="fixed left-0 right-0 top-0 h-16 grid place-items-center bg-gradient-to-r from-[#02c8a7] to-[#7cdbd5] from-25% to-100% z-30">
      <Link href="/" className="text-2xl text-white">
        ポケモンずかん
      </Link>
    </header>
  );
};
