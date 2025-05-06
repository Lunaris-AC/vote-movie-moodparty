
import { useState, useEffect } from 'react';
import { Film } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';
import { getFilms } from '@/services/filmService';
import { useToast } from '@/components/ui/use-toast';

const VoteFilms = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [filmSelectionne, setFilmSelectionne] = useState<Film | null>(null);
  const [chargement, setChargement] = useState(true);
  const { toast } = useToast();
  
  const totalVotes = films.reduce((sum, film) => sum + film.votes, 0);
  
  useEffect(() => {
    const chargerFilms = async () => {
      try {
        const donneesFilms = await getFilms();
        setFilms(donneesFilms);
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les films. Veuillez réessayer plus tard.",
        });
      } finally {
        setChargement(false);
      }
    };
    
    chargerFilms();
  }, [toast]);
  
  const handleFilmSelect = (film: Film) => {
    setFilmSelectionne(film);
  };
  
  const handleVote = (filmId: string) => {
    setFilms(films.map(film => 
      film.id === filmId 
        ? { ...film, votes: film.votes + 1 } 
        : film
    ));
  };
  
  const handleBackToGrid = () => {
    setFilmSelectionne(null);
  };

  if (chargement) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cinema-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Chargement des films...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Soirée Vote de Films</h1>
        <p className="text-xl text-gray-300">Votez pour votre film préféré et voyez les résultats en temps réel !</p>
      </div>
      
      {filmSelectionne ? (
        <MovieDetail 
          film={filmSelectionne} 
          onBack={handleBackToGrid} 
          onVote={handleVote}
          totalVotes={totalVotes}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {films.map(film => (
            <MovieCard 
              key={film.id} 
              film={film} 
              onSelect={handleFilmSelect}
              totalVotes={totalVotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoteFilms;
