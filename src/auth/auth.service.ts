import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, registerDto } from "./dto/dto";
import * as bcrypt from "bcrypt";
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }
    async register(dto: registerDto) {
        const salt = 10
        const hashPas = await bcrypt.hash(dto.password, salt)
        const user = await this.prisma.users.create({
            data: {
                phone: dto.phone,
                password: hashPas,
                fullName: dto.fullName,
                deviceName: [dto.deviceName],
                role: dto.role || "STUDENT",
            }
        })
        return {
            message: 'user successfully registred.Go to login to use website',
            user: {
                id: user.id,
                phone: user.phone,
                fullName: user.fullName,
                role: user.role,
                deviceName: user.deviceName

            }
        }
    }
    async login(dto: LoginDto) {
        const user=await this.prisma.users.findFirst({
            where:{phone:dto.phone}
        })
        if()
    }
    async

}