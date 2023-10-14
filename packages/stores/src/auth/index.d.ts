type OAuth = {
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
export type User = {
    _id: string;
    oauth: OAuth;
    confirmed: boolean;
    email: string;
    ra: number;
    createdAt: string;
    devices: Device[];
};
type UseAuthStore = {
    user: User | null;
    token: string | null;
    isLoggedIn: () => boolean;
    authenticate: (token: string) => void;
};
declare const useAuthStore: Omit<import("zustand/vanilla").StoreApi<UseAuthStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<UseAuthStore, UseAuthStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: UseAuthStore) => void) => () => void;
        onFinishHydration: (fn: (state: UseAuthStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<UseAuthStore, UseAuthStore>>;
    };
};
export default useAuthStore;
//# sourceMappingURL=index.d.ts.map