
import { useState } from 'react';
import { Film } from '../types/movie';
import { Film as FilmIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieCardProps {
  film: Film;
  onSelect: (film: Film) => void;
  totalVotes: number;
}

const MovieCard = ({ film, onSelect, totalVotes }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const pourcentageVotes = totalVotes > 0 ? Math.round((film.votes / totalVotes) * 100) : 0;
  
  return (
    <div 
      className="movie-card relative rounded-lg overflow-hidden cursor-pointer h-96"
      onClick={() => onSelect(film)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
      <img 
        src={film.image} 
        alt={film.titre} 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300" 
        style={{ transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}>
        <h3 className="text-xl font-bold text-white mb-1">{film.titre}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <FilmIcon size={16} className="text-cinema-purple" />
          <span className="text-sm text-gray-200">Voter maintenant</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div 
            className="vote-bar bg-cinema-purple h-2.5 rounded-full" 
            style={{ width: `${pourcentageVotes}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-300">
          <span>{pourcentageVotes}% des votes</span>
          <span>{film.votes} votes</span>
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-3 border border-cinema-purple text-cinema-purple hover:bg-cinema-purple/20"
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
