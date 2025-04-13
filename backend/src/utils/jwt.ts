import jwt, { JwtPayload } from 'jsonwebtoken';


const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET as string
console.log("refresh token secret",REFRESH_TOKEN_SECRET);
console.log("access token secret",ACCESS_TOKEN_SECRET);


export const generateAccessToken = (data: object): string => {
    
    return jwt.sign(
        data, 
        ACCESS_TOKEN_SECRET as string,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (data: object): string => {
    return jwt.sign(
        data, 
        REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d' }
    );
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
    try {
        const decoded=jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload; 
        return decoded;
    } catch {
        return null;
    }
};


export const verifyAccessToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload; 
    } catch {
        return null;
    }
};

