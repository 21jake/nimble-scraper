import { IUser } from "./user.model";

export interface IBatch {
    id: number;
    originalName: string;
    fileName: string;
    uploaderId: number;
    uploader: IUser
    // uploaderId?: number;
    // uploader?: IUser
    // createdDate: Date;
    createdDate: Date | string;
}