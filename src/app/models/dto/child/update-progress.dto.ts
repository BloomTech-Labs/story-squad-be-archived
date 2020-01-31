import { IsBoolean, IsOptional } from 'class-validator';

import { Activities } from '@models';

export class UpdateProgressDTO implements Partial<Activities> {
  @IsBoolean()
  @IsOptional()
  public reading?: boolean;

  @IsBoolean()
  @IsOptional()
  public writing?: boolean;

  @IsBoolean()
  @IsOptional()
  public submission?: boolean;

  @IsBoolean()
  @IsOptional()
  public teamReview?: boolean;

  @IsBoolean()
  @IsOptional()
  public randomReview?: boolean;

  @IsBoolean()
  @IsOptional()
  public results?: boolean;
}
