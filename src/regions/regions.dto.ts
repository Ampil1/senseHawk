
import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class LLLocationDTO {
    @ApiModelProperty()
    @IsString()
    type: string = 'Point';

    @IsNotEmpty()
    @ApiModelProperty()
    coordinates: [number];
}
export class CreateRegionDto {

    @ApiModelProperty()
    @IsNotEmpty()
    regionName: string;

    @ApiModelProperty()
    description: string;

    @ApiModelProperty()
    owner?: string

    @IsNotEmpty()
    @ApiModelProperty()
    location: LLLocationDTO;
    @ApiModelProperty()
    UID?: string
}


export class UpdateRegionDto {

    @ApiModelProperty()
    regionName?: string;

    @ApiModelProperty()
    description?: string;

    @ApiModelProperty()
    owner?: string

    @ApiModelProperty()
    location: LLLocationDTO;
    UID?: string
}