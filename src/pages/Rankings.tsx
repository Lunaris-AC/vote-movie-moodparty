import { useState, useEffect } from 'react';
import { Film } from '@/types/movie';
import { getFilms } from '@/services/filmService';
import { useToast } from '@/components/ui/use-toast';

const Rankings = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [chargement, setChargement] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const chargerFilms = async () => {
      try {
        const donneesFilms = await getFilms();
        // Trier les films par nombre de votes décroissant
        const filmsTries = donneesFilms.sort((a, b) => b.votes - a.votes);
        setFilms(filmsTries);
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les classements. Veuillez réessayer plus tard.",
        });
      } finally {
        setChargement(false);
      }
    };

    chargerFilms();
  }, [toast]);

  if (chargement) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cinema-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Chargement des classements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Classement des Films</h1>
        <p className="text-xl text-gray-300">Découvrez les films les plus populaires !</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {films.map((film, index) => (
          <div
            key={film.id}
            className="bg-gray-800 rounded-lg p-6 mb-4 flex items-center space-x-4"
          >
            <div className="text-2xl font-bold text-cinema-purple w-12">
              #{index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{film.titre}</h3>
              <p className="text-gray-400">{film.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cinema-purple">
                {film.votes}
              </div>
              <div className="text-sm text-gray-400">votes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rankings; 