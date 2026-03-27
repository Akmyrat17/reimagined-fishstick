import { Module } from "@nestjs/common";
import { MainPageController } from "./main-page.controller";
import { TagsRepository } from "../tags/repositories/tags.repository";
import { QuestionsService } from "../questions/services/questions.service";
import { QuestionsRepository } from "../questions/repositories/questions.repository";
import { VotesRepository } from "../votes/repositories/votes.repository";
import { AnswersRepository } from "../answers/repositories/answers.repository";
import { AnswersService } from "../answers/services/answers.service";
// import { SearchService } from "../questions/services/search.service";

@Module({
    controllers: [MainPageController],
    providers: [TagsRepository, QuestionsService, QuestionsRepository, VotesRepository, AnswersRepository, AnswersService],
    exports: []
})
export class MainPageModule { }