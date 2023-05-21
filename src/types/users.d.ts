type OAuth = {
  email: string;
  emailFacebook?: string;
  emailGoogle?: string;
  facebook?: string;
  google?: string;
  picture?: string;
};

type Device = {
  _id: string;
  deviceId: string;
  token: string;
  phone: string;
};

export type User = {
  _id: string;
  oauth: OAuth;
  confirmed: boolean;
  email: string;
  ra: number;
  createdAt: Date;
  devices: Device[];
};
