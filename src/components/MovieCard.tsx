
import { useState } from 'react';
import { Movie } from '../types/movie';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  totalVotes: number;
}

const MovieCard = ({ movie, onSelect, totalVotes }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const votePercentage = totalVotes > 0 ? Math.round((movie.votes / totalVotes) * 100) : 0;
  
  return (
    <div 
      className="movie-card relative rounded-lg overflow-hidden cursor-pointer h-96"
      onClick={() => onSelect(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300" 
        style={{ transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}>
        <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Film size={16} className="text-cinema-purple" />
          <span className="text-sm text-gray-200">Vote now</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div 
            className="vote-bar bg-cinema-purple h-2.5 rounded-full" 
            style={{ width: `${votePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-300">
          <span>{votePercentage}% of votes</span>
          <span>{movie.votes} votes</span>
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-3 border border-cinema-purple text-cinema-purple hover:bg-cinema-purple/20"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MovieCard;
