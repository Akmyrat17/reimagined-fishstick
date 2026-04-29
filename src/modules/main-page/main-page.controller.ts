import { BadRequestException, Controller, Get, Head, Headers, UseGuards } from "@nestjs/common";
import { TagsRepository } from "../tags/repositories/tags.repository";
import { QuestionsService } from "../questions/services/questions.service";
import { AnswersRepository } from "../answers/repositories/answers.repository";
import { VotesRepository } from "../votes/repositories/votes.repository";
import { LangEnum, QuestionsFilterEnum } from "src/common/enums";
import { QuestionsSortEnum } from "src/common/enums/questions-sort.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { OptionalJwtAuthGuard } from "../auth/jwt/optional.jwt-auth.guard";

@Controller('main-page')
export class MainPageController {
    constructor(
        private readonly tagsRepository: TagsRepository,
        private readonly questionsService: QuestionsService,
        private readonly answersRepository: AnswersRepository,
        private readonly votesRepository: VotesRepository,
    ) { }

    @Get("sidebar")
    @UseGuards(OptionalJwtAuthGuard)
    async getMainPage(@Headers('lang') lang: LangEnum, @CurrentUser('id') userId: number) {
        try {
            const famousTags = await this.tagsRepository.getFamousTags(lang, 10);
            const lastHourQuestions = await this.questionsService.lastHourQuestions();
            const lastHourAnswers = await this.answersRepository.getLastHourAnswers();
            const lastHourVotes = await this.votesRepository.getLastHourVotes();
            const famousUnansweredQuestions = await this.questionsService.getAll({ page: 1, limit: 10, sort: QuestionsSortEnum.VOTES_DESC, filters: QuestionsFilterEnum.HAS_NOT_ANSWERS }, userId);
            const famousAnsweredQuestions = await this.questionsService.getAll({ page: 1, limit: 10, sort: QuestionsSortEnum.VOTES_DESC, filters: QuestionsFilterEnum.HAS_ANSWERS }, userId);
            return { famousTags, lastHourQuestions, lastHourAnswers, lastHourVotes, famousUnansweredQuestions, famousAnsweredQuestions };
        } catch (error: any) {
            console.log(error);
            throw new BadRequestException(error.detail ?? error.message)
        }
    }
}