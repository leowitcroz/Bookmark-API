import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('singup')
    async singup() {
        return 'i am sining up'
    }

    @Post('singin')
    singn() {
        return 'i am sining in'
    }


}