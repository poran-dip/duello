export interface Participant {
  id: string;
  name: string;
  notes?: string;
}

export type Stage = "setup" | "dueling" | "results";
