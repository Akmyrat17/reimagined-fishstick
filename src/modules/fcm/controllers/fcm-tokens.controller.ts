import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { FcmTokensService } from "../services/fcm-tokens.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { FcmTokensRequestDto } from "../dtos/request-fcm-tokens.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";

@Controller({ path: 'fcm-tokens' })
@UseGuards(JwtAuthGuard)
export class FcmTokensController {
    constructor(private readonly fcmTokensService: FcmTokensService) { }

    @Post('create-or-activate')
    async createOrActivateFcmToken(@CurrentUser('id', ParseIntPipe) userId: number, @Body() dto: FcmTokensRequestDto) {
        return await this.fcmTokensService.createOrActivateFcmToken(userId, dto.token);
    }

    @Post('deactivate')
    @HttpCode(HttpStatus.OK)
    async deactivateFcmToken(@CurrentUser('id', ParseIntPipe) userId: number, @Body() dto: FcmTokensRequestDto) {
        return await this.fcmTokensService.deactivateFcmToken(userId, dto.token);
    }
}