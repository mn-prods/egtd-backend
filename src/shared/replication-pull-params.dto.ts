import { IsNumber, IsString } from "class-validator";

export class ReplicationPullParams {
    @IsString()
    id: string;

    @IsNumber()
    updatedAt: number;

    @IsNumber()
    batchSize: number;
}