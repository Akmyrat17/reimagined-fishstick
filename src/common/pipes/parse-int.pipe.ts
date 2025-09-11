import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ParseIntCustomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    // Implement your custom logic here

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('validation.parse_int_pipe');
    }
  }
}
