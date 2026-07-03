import { Schema } from 'mongoose';
export declare const User: import("mongoose").Model<{
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
}, import("mongoose").Document<unknown, {}, {
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    username: string;
    email: string;
    password: string;
    createdAt: NativeDate;
    favorites: import("mongoose").Types.ObjectId[];
    profile?: {
        avatar: string;
        bio: string;
        social?: {
            twitter?: string | null;
            discord?: string | null;
        } | null;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=User.d.ts.map