type Oauth = {
    email: string;
    facebook: string;
    picture: string;
    emailFacebook: string;
};
type Device = {
    _id: string;
    deviceId: string;
    token: string;
    phone: string;
};
type User = {
    _id: string;
    oauth: Oauth;
    confirmed: boolean;
    email: string;
    ra: number;
    createAt: string;
    devices: Device[];
};
declare const user: {
    completeSignup: (params?: {}) => Promise<import("axios").AxiosResponse<any, any>>;
    confirmSignup: (params?: {}) => Promise<import("axios").AxiosResponse<any, any>>;
    resendEmail: () => Promise<import("axios").AxiosResponse<any, any>>;
    recovery: (email: string) => Promise<import("axios").AxiosResponse<any, any>>;
    delete: () => Promise<import("axios").AxiosResponse<any, any>>;
    info: () => Promise<import("axios").AxiosResponse<User, any>>;
};
export default user;
//# sourceMappingURL=users.d.ts.map