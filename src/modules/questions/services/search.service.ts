import { Client } from "@elastic/elasticsearch";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { QuestionsEntity } from "../entities/questions.entity";

@Injectable()
export class SearchService implements OnModuleInit {
    private readonly logger = new Logger(SearchService.name);
    private client = new Client({
        node: process.env.ELASTICSEARCH_URL || 'http://localhost:9201',
    });

    async onModuleInit() {
        // Initialize index with edge n-gram analyzer on startup
        await this.initializeIndex();
    }

    private async initializeIndex() {
        try {
            const indexExists = await this.client.indices.exists({ index: 'questions' });
            this.logger.log(`Index exists check: ${indexExists.body}`);

            if (!indexExists.body) {
                this.logger.log('Creating questions index with edge n-gram analyzer...');
                await this.client.indices.create({
                    index: 'questions',
                    body: {
                        settings: {
                            number_of_shards: 1,
                            number_of_replicas: 0,
                            analysis: {
                                analyzer: {
                                    edge_ngram_analyzer: {
                                        type: 'custom',
                                        tokenizer: 'edge_ngram_tokenizer',
                                        filter: ['lowercase'],
                                    },
                                    standard_analyzer: {
                                        type: 'standard',
                                        stopwords: '_english_',
                                    },
                                },
                                tokenizer: {
                                    edge_ngram_tokenizer: {
                                        type: 'edge_ngram',
                                        min_gram: 1,
                                        max_gram: 20,
                                        token_chars: ['letter', 'digit'],
                                    },
                                },
                            },
                        },
                        mappings: {
                            properties: {
                                id: { type: 'integer' },
                                title: {
                                    type: 'text',
                                    analyzer: 'edge_ngram_analyzer',
                                    search_analyzer: 'standard_analyzer',
                                    fields: {
                                        keyword: { type: 'keyword' },
                                    },
                                },
                                tag_ids: { type: 'integer' },
                            },
                        },
                    },
                });
                this.logger.log('✅ Questions index created successfully with edge n-gram analyzer');
            } else {
                this.logger.log('ℹ️ Questions index already exists');
            }
        } catch (error) {
            this.logger.error('❌ Error initializing index:', error.message);
            this.logger.error('Full error:', error);
        }
    }

    async searchQuestions(keyword?: string, tagIds?: number[]) {
        const mustClauses = [];

        // Only add text search if keyword exists
        if (keyword && keyword.trim() !== "") {
            mustClauses.push({
                bool: {
                    should: [
                        { match: { title: { query: keyword, boost: 3 } } },
                    ],
                    minimum_should_match: 1,
                },
            });
        }

        const filterClauses: any[] = [];

        if (tagIds?.length && tagIds.filter(Boolean).length)
            filterClauses.push({ terms: { tags_id: tagIds.filter(Boolean) } });

        // If no keyword and no filters, match all
        const query = {
            bool: {
                ...(mustClauses.length ? { must: mustClauses } : { must: [{ match_all: {} }] }),
                ...(filterClauses.length ? { filter: filterClauses } : {}),
            },
        };

        const result = await this.client.search({
            index: 'questions',
            body: { query,size:10000 },
            explain: true
        });

        return result.body.hits.hits.map(x => Number(x._id));
    }

    async indexQuestion(question: QuestionsEntity) {
        const body = {
            id: question.id,
            title: question.title,
            tags_id: question.tags.map(x => x.id),
        }
        try {
            await this.client.index({
                index: 'questions',
                id: question.id.toString(),
                body,
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async updateQuestion(question: QuestionsEntity) {
        const body = {
            id: question.id,
            title: question.title,
            tags_id: question.tags.map(x => x.id),
        }
        try {
            await this.client.update({
                index: 'questions',
                id: question.id.toString(),
                body: {
                    doc: body,
                },
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async deleteQuestion(question: QuestionsEntity) {
        try {
            await this.client.delete({
                index: 'questions',
                id: question.id.toString(),
            });
        } catch (error) {
            // If ES says "not found", ignore it.
            if (error.meta?.body?.result === 'not_found') return;
            this.logger.error(error);
        }
    }
}