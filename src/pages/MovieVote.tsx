
import { useState } from 'react';
import { movies as initialMovies } from '@/data/movies';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';

const MovieVote = () => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const totalVotes = movies.reduce((sum, movie) => sum + movie.votes, 0);
  
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  
  const handleVote = (movieId: number) => {
    setMovies(movies.map(movie => 
      movie.id === movieId 
        ? { ...movie, votes: movie.votes + 1 } 
        : movie
    ));
  };
  
  const handleBackToGrid = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Movie Vote Party</h1>
        <p className="text-xl text-gray-300">Vote for your favorite movie and see the results in real-time!</p>
      </div>
      
      {selectedMovie ? (
        <MovieDetail 
          movie={selectedMovie} 
          onBack={handleBackToGrid} 
          onVote={handleVote}
          totalVotes={totalVotes}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onSelect={handleMovieSelect}
              totalVotes={totalVotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieVote;
