import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';
import { getFilms } from '@/services/filmService';
import { useToast } from '@/components/ui/use-toast';
import { submitVote, hasVoted } from '@/services/voteService';

const VoteFilms = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [filmSelectionne, setFilmSelectionne] = useState<Film | null>(null);
  const [chargement, setChargement] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const totalVotes = films.reduce((sum, film) => sum + film.votes, 0);
  
  useEffect(() => {
    // Rediriger vers les classements si l'utilisateur a déjà voté
    if (hasVoted()) {
      navigate('/rankings');
      return;
    }

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
  }, [toast, navigate]);
  
  const handleFilmSelect = (film: Film) => {
    setFilmSelectionne(film);
  };
  
  const handleVote = async (filmId: string) => {
    try {
      const result = await submitVote({ 
        filmId, 
        adresseIP: '',
        nomVotant: 'Anonyme'
      });
      
      if (result.success) {
        setFilms(films.map(film => 
          film.id === filmId 
            ? { ...film, votes: film.votes + 1 } 
            : film
        ));
        toast({
          title: "Succès",
          description: result.message,
        });
        // Rediriger vers la page des classements
        navigate('/rankings');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du vote. Veuillez réessayer.",
      });
    }
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
