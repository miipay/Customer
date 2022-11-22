import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, IsISO31661Alpha3 } from 'class-validator';
import { IsLocalMobileNumber, IsLocalPhoneNumber } from './validators/localPhoneNumber.decorator';

export class UpdateIndividualDto {
  @IsISO31661Alpha3()
  @IsString()
  country: string;
  @IsNotEmpty()
  @IsString()
  idNumber: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsString()
  @IsOptional()
  middleName: string;
  @IsString()
  @IsOptional()
  lastName: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsLocalMobileNumber('country')
  @IsOptional()
  mobile: string;
  @IsLocalPhoneNumber('country')
  @IsOptional()
  phoneNumber: string;
}

export class CreateIndividualDto extends UpdateIndividualDto {
  @IsBoolean()
  @IsOptional()
  enabled: boolean;
}
