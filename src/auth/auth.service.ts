import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService) { }

    async singUp(dto: AuthDto) {
        // generate passowrd

        const hash = await argon.hash(dto.password);

        // save new user in the db

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            delete user.hash;

            //return the saved user
            return user

        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credeation taken')
                }
            } throw (error)
        }
    }

    login() {

    }


}