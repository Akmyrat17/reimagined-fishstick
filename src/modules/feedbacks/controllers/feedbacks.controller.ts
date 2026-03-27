import { Body, Controller, Post } from "@nestjs/common";
import { FeedbacksService } from "../services/feedbacks.service";
import { FeedbacksCreateDto } from "../dtos/create-feedbacks.dto";

@Controller({ path: "feedbacks" })
export class FeedbacksController {
    constructor(private readonly feedbacksService: FeedbacksService) { }

    @Post()
    async create(@Body() dto: FeedbacksCreateDto) {
        return await this.feedbacksService.create(dto);
    }
}