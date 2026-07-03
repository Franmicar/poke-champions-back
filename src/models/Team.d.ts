import { Schema } from 'mongoose';
export declare const Team: import("mongoose").Model<{
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    userId: import("mongoose").Types.ObjectId;
    format: string;
    pokemon: import("mongoose").Types.DocumentArray<{
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, import("mongoose").Types.Subdocument<import("mongodb").ObjectId, unknown, {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }, {}, {}> & {
        species: string;
        level: number;
        shiny: boolean;
        moves: string[];
        nickname?: string | null;
        item?: string | null;
        ability?: string | null;
        nature?: string | null;
        teraType?: string | null;
        evs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
        ivs?: {
            hp: number;
            atk: number;
            def: number;
            spa: number;
            spd: number;
            spe: number;
        } | null;
    }>;
    isPublic: boolean;
    createdAt: NativeDate;
    description?: string | null;
    stats?: {
        votes: number;
        views: number;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Team.d.ts.map