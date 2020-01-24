import { IsInt, Min, Max, Length, IsEmpty } from 'class-validator';
import { Child } from '../../../database/entity';

class UpdateChildDTO implements Partial<Child> {
    @Length(4, 32, { message: "Your child's username must be between 4 to 32 characters" })
    username: string;

    @IsInt()
    @Min(3)
    @Max(6)
    grade: number;

    @IsEmpty({ message: 'IDs cannot be changed' })
    id?: null;

    @IsEmpty({ message: 'You cannot change your parent at this time' })
    parent?: null;

    @IsEmpty({ message: 'Subscriptions must be updated through the dashboard' })
    subscription?: null;
}

export { UpdateChildDTO };
