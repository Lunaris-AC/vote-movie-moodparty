
export interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
  trailerUrl: string;
  votes: number;
}

export interface VoteData {
  movieId: number;
  voterName: string;
  ipAddress: string;
}
