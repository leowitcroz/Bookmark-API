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

    async singIn(dto: AuthDto) {

        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user doesnt exist throw expetion

        if (!user) throw new ForbiddenException(
            'Credentials incorrect'
        );

        //compare passowrd

        const pwMatches = await argon.verify
            (
                user.hash,
                dto.password
            )


        // if password wrong throw expetion

        if (!pwMatches) throw new ForbiddenException(
            'Credentials incorrect',
        )

        // send back the user

        delete user.hash

        return user;
    }


}