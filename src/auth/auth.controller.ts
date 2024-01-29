import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "src/dto";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('singup')
    async singup(@Body() dto: AuthDto) {
        
        return this.authService.singUp(dto);
    }

    @Post('singin')
    singn() {
        return 'i am sining in'
    }


}