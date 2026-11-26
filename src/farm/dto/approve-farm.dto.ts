
import { IsEnum, IsIn } from 'class-validator';
import { FarmTrustLevel } from '../entities/farm.entity';

export class ApproveFarmDto {
  @IsIn(['Low', 'Medium', 'High'],{
    message: 'Cấp độ tin cậy không hợp lệ',
  })
  trustLevel!: FarmTrustLevel;
}
