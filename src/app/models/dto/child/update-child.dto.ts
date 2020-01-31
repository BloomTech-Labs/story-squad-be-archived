import { IsInt, Min, Max, Length, IsEmpty } from 'class-validator';

export class UpdateChildDTO {
  @Length(4, 32, { message: "Your child's username must be between 4 to 32 characters" })
  public username: string;

  @IsInt()
  @Min(3)
  @Max(6)
  public grade: number;

  @IsEmpty({ message: 'IDs cannot be changed' })
  public id?: null;

  @IsEmpty({ message: 'You cannot change your parent at this time' })
  public parent?: null;

  @IsEmpty({ message: 'Subscriptions must be updated through the dashboard' })
  public subscription?: null;
}
