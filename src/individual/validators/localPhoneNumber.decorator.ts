import {
  isMobilePhone,
  isPhoneNumber,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
/**
 * validate the local phone number with a property as the country code
 */
export const IsLocalPhoneNumber =
  (countryCodeProperty: string, validationOptions?: ValidationOptions) => (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isLocalPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [countryCodeProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [countryCodeProperty] = args.constraints;
          const countryCode = (args.object as any)[countryCodeProperty];
          return isPhoneNumber(value, countryCode);
        },
      },
    });
  };

/**
 * validate the local mobile number with a property as the country code
 */
export const IsLocalMobileNumber =
  (countryCodeProperty: string, validationOptions?: ValidationOptions) => (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isLocalMobileNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [countryCodeProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [countryCodeProperty] = args.constraints;
          const countryCode = (args.object as any)[countryCodeProperty];
          return isMobilePhone(value, countryCode);
        },
      },
    });
  };
