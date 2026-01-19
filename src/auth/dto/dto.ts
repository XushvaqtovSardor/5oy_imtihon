import { IsNotEmpty, IsString } from "class-validator";
export enum UserRole {
    ADMIN = 'ADMIN',
    MENTOR = 'MENTOR',
    ASSISTANT = 'ASSISTANT',
    STUDENT = 'STUDENT',
}
export class registerDto {
    @IsString()
    @IsNotEmpty()
    phone: string

    @IsString()
    @IsNotEmpty()
    otp: string

    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    password: string
    

    @IsString()
    role: UserRole

    @IsString()
    @IsNotEmpty()
    deviceName:string

}

export class verify {

}
export class LoginDto{
    @IsString()
    @IsNotEmpty()
    phone:string

    @IsString()
    @IsNotEmpty()
    password:string
    
    @IsString()
    @IsNotEmpty()
    deviceName:string

}