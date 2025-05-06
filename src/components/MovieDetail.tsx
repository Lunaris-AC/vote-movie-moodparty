
import { useState } from 'react';
import { Film, VoteData } from '../types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Vote } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { obtenirAdresseIP, soumettreVote } from '@/services/filmService';

interface MovieDetailProps {
  film: Film;
  onBack: () => void;
  onVote: (filmId: string) => void;
  totalVotes: number;
}

const MovieDetail = ({ film, onBack, onVote, totalVotes }: MovieDetailProps) => {
  const [nomVotant, setNomVotant] = useState('');
  const [soumission, setSoumission] = useState(false);
  const { toast } = useToast();
  const pourcentageVotes = totalVotes > 0 ? Math.round((film.votes / totalVotes) * 100) : 0;

  const handleVote = async () => {
    if (nomVotant.trim().length < 2) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom pour voter",
        variant: "destructive"
      });
      return;
    }

    setSoumission(true);
    const adresseIP = await obtenirAdresseIP();
    
    const donneesVote: VoteData = {
      filmId: film.id,
      nomVotant,
      adresseIP
    };
    
    try {
      const resultat = await soumettreVote(donneesVote);
      
      if (resultat.succes) {
        onVote(film.id);
        toast({
          title: "Vote soumis !",
          description: resultat.message,
        });
      } else {
        toast({
          title: "Échec du vote",
          description: resultat.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de votre vote. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSoumission(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cinema-dark bg-opacity-95 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-cinema-purple hover:text-cinema-accent hover:bg-transparent"
        >
          <ArrowLeft className="mr-2" size={16} />
          Retour aux Films
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={film.image} 
              alt={film.titre} 
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{film.titre}</h1>
              <p className="text-gray-300">{film.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Statistiques des Votes</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className="vote-bar bg-cinema-purple h-3 rounded-full" 
                  style={{ width: `${pourcentageVotes}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>{pourcentageVotes}% des votes</span>
                <span>{film.votes} sur {totalVotes} votes au total</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-white mb-4">Votez</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Votre Nom
                  </label>
                  <Input
                    id="name"
                    value={nomVotant}
                    onChange={(e) => setNomVotant(e.target.value)}
                    placeholder="Entrez votre nom"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    disabled={soumission}
                  />
                </div>
                <Button 
                  onClick={handleVote}
                  disabled={soumission || nomVotant.trim().length < 2}
                  className="w-full bg-cinema-purple hover:bg-cinema-purple/80 text-white"
                >
                  {soumission ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Traitement en cours...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Vote className="mr-2" size={16} />
                      Voter pour {film.titre}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="my-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Regarder la Bande-annonce</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              className="w-full h-[400px] rounded-lg"
              src={film.trailer_url}
              title={`Bande-annonce de ${film.titre}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
