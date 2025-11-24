import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { VotesService } from "../services/votes.service";
import { VotesToggleDto } from "../dtos/toggle-votes.dto";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/modules/auth/jwt/jwt-auth.guard";

@Controller({path:"votes"})
@UseGuards(JwtAuthGuard)
export class VotesController {
    constructor(private readonly votesService:VotesService) {}
    @Post()
    async toggle(@Body() dto:VotesToggleDto,@CurrentUser('id') userId:number) {
        return await this.votesService.toggleVote(userId,dto)
    }
}