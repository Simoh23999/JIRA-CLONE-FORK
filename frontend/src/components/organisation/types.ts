export interface Organizer {
  id: string | number;
  fullName: string;
  avatarUrl?: string;
}
export interface Member {
  memberishipId:number|string;
  userId: number|string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Organization {
  id: string | number;
  name: string;
  description?: string;
  avatarUrl?: string;
  organizer?: {
    id: string | number;
    fullName: string;
    avatarUrl?: string;
  };
  members?: Member[];
  bannerUrl?: string;
}

