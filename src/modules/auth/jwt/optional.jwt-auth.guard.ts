import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
    handleRequest(err: any, user: any, info: any,context: ExecutionContext) {
        if (err || !user) {
            return null;
        }
        return user;
    }
}