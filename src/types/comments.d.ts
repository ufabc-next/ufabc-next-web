import { Grade } from '@/types/grades';

export type Comment = {
  _id: string;
  comment: string;
  createdAt: string;
  enrollment: {
    _id: string;
    conceito: Grade;
    creditos: number;
    quad: number;
    year: number;
    season?: string;
  };
  myReactions: {
    like: boolean;
    recommendation: boolean;
    star: boolean;
  };
  subject: {
    __v: number;
    _id: string;
    createdAt: string;
    creditos: number;
    name: string;
    search: string;
    updatedAt: string;
  };
  reactionsCount?: { like: number; recommendation: number };
  teacher: string;
  updatedAt: string;
};

export type MakeCommentRequest = {
  _id: string; //'64cd102b23ba5ec91f4e35c9';
  comment: string;
  createdAt: string; //'2023-08-04T14:50:19.276Z';
  enrollment: {
    _id: string; //'64795ea00885b36740c160fc';
  };
  subject: string; //'5bf5fbdb436c414f35a8ef4e';
  teacher: string; //'5bf5fb65d741524f090c9112';
  updatedAt: string; //'2023-08-04T14:50:19.276Z';
};
export type CommentResponse = {
  data: Comment[];
  total: number;
};
