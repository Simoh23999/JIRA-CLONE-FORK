export type ProjectMember ={
    id:number|string ;// ID du ProjectMembership
    membershipId:string|number; // ID de la Membership
    fullName:string ; // nom complet du user lié à la Membership
    email:string ; // email du user
    roleInProject:  "PROJECT_OWNER" | "PROJECT_MEMBER" ; // rôle dans le projet
    avatarUrl?:string;
}
