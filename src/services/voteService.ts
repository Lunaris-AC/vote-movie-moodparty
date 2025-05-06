import { VoteData } from '../types/movie';

// Cache to store IP addresses that have already voted
const votedIPs: Set<string> = new Set();

export const checkIPVoted = async (): Promise<string> => {
  try {
    // Using a free IP API to get the user's IP
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '';
  }
};

export const hasVoted = (): boolean => {
  return localStorage.getItem('hasVoted') === 'true';
};

export const setVoted = (): void => {
  localStorage.setItem('hasVoted', 'true');
};

export const submitVote = async (voteData: VoteData): Promise<{ success: boolean; message: string }> => {
  // Check if user has already voted
  if (hasVoted()) {
    return { 
      success: false, 
      message: "Vous avez déjà voté ! Un seul vote par personne est autorisé."
    };
  }

  // Check if this IP has already voted
  if (votedIPs.has(voteData.adresseIP)) {
    return { 
      success: false, 
      message: "Vous avez déjà voté ! Un seul vote par personne est autorisé."
    };
  }

  // In a real app, this would send data to a backend
  // For this demo, we just simulate a successful vote
  votedIPs.add(voteData.adresseIP);
  setVoted();
  
  return { 
    success: true, 
    message: "Votre vote a été comptabilisé ! Merci de votre participation!" 
  };
};
