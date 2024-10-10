export type Pokemon = {
  id: number;
  name: string;
  url: string;
  jaName: string;
  roName: string;
  jaGenus: string;
  image: {
    thumb: string;
    artwork: string;
  };
  types: string[];
  flavorText: string;
};
