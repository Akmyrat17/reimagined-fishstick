import { ConstantPagesCreateDto } from "./create-constant-pages.dto";
import { PartialType } from "@nestjs/mapped-types";

export class ConstantPagesUpdateDto extends PartialType(ConstantPagesCreateDto) { }