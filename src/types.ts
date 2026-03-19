export enum Frequency {
  DAILY = 'Diário',
  WEEKLY = 'Semanal',
  MONTHLY = 'Mensal',
  ANNUAL = 'Anual'
}

export enum GroupType {
  NORMAL = 'Normal',
  CORPORATE = 'Corporativo',
  INFORMAL = 'Informal'
}

export interface KixikilaGroup {
  id: string;
  name: string;
  contribution: number;
  frequency: Frequency;
  totalMembers: number;
  currentMembers: number;
  startDate: string;
  description: string;
  type: GroupType;
  verified?: boolean;
  status?: 'Cheio' | 'Aberto' | 'Finalizado';
}

export interface User {
  name: string;
  email: string;
  balance: number;
  avatar?: string;
}

export type AppScreen = 
  | 'SPLASH'
  | 'TERMS'
  | 'LOGIN' 
  | 'SIGNUP' 
  | 'DASHBOARD' 
  | 'DEPOSIT' 
  | 'GROUPS' 
  | 'WITHDRAW' 
  | 'SETTINGS' 
  | 'CREATE_GROUP' 
  | 'MY_GROUPS' 
  | 'CORPORATE' 
  | 'VOTING'
  | 'NOTES';
