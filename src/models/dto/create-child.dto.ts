import { IsInt, Min, Max, Length } from 'class-validator';

class CreateChildDTO {
    @Length(4, 32, { message: "Your child's username must be between 4 to 32 characters" })
    username: string;

    @IsInt()
    @Min(3)
    @Max(6)
    grade: number;
}

export { CreateChildDTO };
