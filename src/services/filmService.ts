
import { supabase } from "@/integrations/supabase/client";
import { Film, VoteData } from "@/types/movie";

export const getFilms = async (): Promise<Film[]> => {
  const { data, error } = await supabase
    .from('films')
    .select('*')
    .order('votes', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des films:', error);
    throw error;
  }

  return data || [];
};

export const getFilmById = async (id: string): Promise<Film | null> => {
  const { data, error } = await supabase
    .from('films')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération du film ${id}:`, error);
    throw error;
  }

  return data;
};

export const verifierVoteExistant = async (adresseIP: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('adresse_ip', adresseIP)
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la vérification du vote existant:', error);
    throw error;
  }

  return !!data;
};

export const soumettreVote = async (voteData: VoteData): Promise<{ succes: boolean; message: string }> => {
  // Vérifier si l'utilisateur a déjà voté
  const aDejaVote = await verifierVoteExistant(voteData.adresseIP);
  
  if (aDejaVote) {
    return {
      succes: false,
      message: "Vous avez déjà voté ! Un seul vote par personne est autorisé."
    };
  }
  
  // Enregistrer le vote
  const { error: insertError } = await supabase
    .from('votes')
    .insert({
      film_id: voteData.filmId,
      nom_votant: voteData.nomVotant,
      adresse_ip: voteData.adresseIP
    });

  if (insertError) {
    console.error('Erreur lors de l\'enregistrement du vote:', insertError);
    return {
      succes: false,
      message: "Une erreur est survenue lors de l'enregistrement de votre vote."
    };
  }

  try {
    // Mettre à jour le compteur de votes du film directement
    const { data: filmData } = await supabase
      .from('films')
      .select('votes')
      .eq('id', voteData.filmId)
      .single();
    
    if (filmData) {
      const { error: updateError } = await supabase
        .from('films')
        .update({ votes: filmData.votes + 1 })
        .eq('id', voteData.filmId);
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du compteur:', updateError);
        return {
          succes: false,
          message: "Votre vote a été enregistré, mais une erreur est survenue lors de la mise à jour du compteur."
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de votes:', error);
    return {
      succes: false,
      message: "Votre vote a été enregistré, mais une erreur est survenue lors de la mise à jour du compteur."
    };
  }

  return {
    succes: true,
    message: "Votre vote a été comptabilisé ! Merci de votre participation !"
  };
};

export const obtenirAdresseIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'adresse IP:', error);
    return '';
  }
};
