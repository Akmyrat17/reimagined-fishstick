import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsToday(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsToday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // allow @IsOptional

          const input = new Date(value);
          if (isNaN(input.getTime())) return false;

          const today = new Date();
          const y = today.getFullYear();
          const m = today.getMonth();
          const d = today.getDate();

          return (
            input.getFullYear() === y &&
            input.getMonth() === m &&
            input.getDate() === d
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be today's date`;
        },
      },
    });
  };
}
