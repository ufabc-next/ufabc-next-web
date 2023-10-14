export type Concept = 'A' | 'B' | 'C' | 'D' | 'F' | 'O';
type EnrollmentTeacher = {
    _id: string;
    name: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
};
type Subject = {
    _id: string;
    name: string;
    search: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
    creditos: number;
};
export type Enrollment = {
    _id: string;
    pratica?: EnrollmentTeacher;
    teoria?: EnrollmentTeacher;
    updatedAt: string;
    conceito: Concept;
    creditos: number;
    disciplina: string;
    quad: number;
    subject: Subject;
    year: number;
};
declare const enrollment: {
    list: () => Promise<import("axios").AxiosResponse<Enrollment[], any>>;
    get: (id: string | number) => Promise<import("axios").AxiosResponse<Enrollment, any>>;
};
export default enrollment;
//# sourceMappingURL=enrollments.d.ts.map