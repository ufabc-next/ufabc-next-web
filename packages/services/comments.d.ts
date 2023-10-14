type CommentBody = object;
declare const comment: {
    get: (teacherId: number | string, subjectId: string | number | undefined, params: object) => Promise<import("axios").AxiosResponse<any, any>>;
    create: (body: CommentBody) => Promise<import("axios").AxiosResponse<any, any>>;
    update: (id: string | number, body: CommentBody) => Promise<import("axios").AxiosResponse<any, any>>;
};
export default comment;
//# sourceMappingURL=comments.d.ts.map