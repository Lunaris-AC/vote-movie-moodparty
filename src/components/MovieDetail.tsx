
import { useState } from 'react';
import { Movie, VoteData } from '../types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Vote } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { checkIPVoted, submitVote } from '@/services/voteService';

interface MovieDetailProps {
  movie: Movie;
  onBack: () => void;
  onVote: (movieId: number) => void;
  totalVotes: number;
}

const MovieDetail = ({ movie, onBack, onVote, totalVotes }: MovieDetailProps) => {
  const [voterName, setVoterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const votePercentage = totalVotes > 0 ? Math.round((movie.votes / totalVotes) * 100) : 0;

  const handleVote = async () => {
    if (voterName.trim().length < 2) {
      toast({
        title: "Name required",
        description: "Please enter your name to vote",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const ipAddress = await checkIPVoted();
    
    const voteData: VoteData = {
      movieId: movie.id,
      voterName,
      ipAddress
    };
    
    const result = await submitVote(voteData);
    
    if (result.success) {
      onVote(movie.id);
      toast({
        title: "Vote submitted!",
        description: result.message,
      });
    } else {
      toast({
        title: "Voting failed",
        description: result.message,
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
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
          Back to Movies
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-300">{movie.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Current Voting Stats</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div 
                  className="vote-bar bg-cinema-purple h-3 rounded-full" 
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>{votePercentage}% of votes</span>
                <span>{movie.votes} out of {totalVotes} total votes</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-white mb-4">Cast Your Vote</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    disabled={isSubmitting}
                  />
                </div>
                <Button 
                  onClick={handleVote}
                  disabled={isSubmitting || voterName.trim().length < 2}
                  className="w-full bg-cinema-purple hover:bg-cinema-purple/80 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Vote className="mr-2" size={16} />
                      Vote for {movie.title}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="my-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Watch Trailer</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              className="w-full h-[400px] rounded-lg"
              src={movie.trailerUrl}
              title={`${movie.title} trailer`}
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
