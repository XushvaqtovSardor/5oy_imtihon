import { IsMobilePhone, IsString } from 'class-validator';

export enum EVerificationTypes {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
  EDIT_PHONE = 'edit_phone',
}
export class PhoneValid {
  @IsMobilePhone()
  @IsString()
  phone: string;
}
