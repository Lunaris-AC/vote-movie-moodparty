
export interface Film {
  id: string;
  titre: string;
  description: string;
  image: string;
  trailer_url: string;
  votes: number;
  created_at: string;
}

export interface Vote {
  id: string;
  film_id: string;
  nom_votant: string;
  adresse_ip: string;
  created_at: string;
}

export interface VoteData {
  filmId: string;
  nomVotant: string;
  adresseIP: string;
}
