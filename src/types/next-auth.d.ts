import 'next-auth';

declare module 'next-auth'{
    interface Session{
        user: {
            _id?: string;
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            name?: string
            suggestedMessages?: Array<Message>;
        }& DefultSession['user']
    }

    interface User{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        name?: string
        suggestedMessages?: Array<Message>;
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        name?: string
        suggestedMessages?: Array<Message>;
    }
}