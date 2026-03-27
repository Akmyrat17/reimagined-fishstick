import { PartialType } from '@nestjs/mapped-types';
import { AddressesCreateDto } from './create-addresses.dto';

export class AddressesUpdateDto extends PartialType(AddressesCreateDto) { }