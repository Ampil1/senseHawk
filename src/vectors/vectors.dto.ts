
import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, IsOptional, IsString, } from "class-validator";

export class LLLocationDTO {
    @ApiModelProperty()
    @IsString()
    type: 'Point';

    @IsNotEmpty()
    @ApiModelProperty()
    coordinates: [number];
}
export class CreateVectorDto {

    @IsNotEmpty()
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    description:string;

    @ApiModelProperty()
    owner: string;

    @IsNotEmpty()
    @ApiModelProperty()
    regions:string;

    @ApiModelProperty()
    UID: string;

    @ApiModelProperty()
    classID: number;

    @ApiModelProperty()
    classTagsName: string;

    @IsNotEmpty()
    @ApiModelProperty()
    location: LLLocationDTO;
}


export class UpdateVectorDto {

    @ApiModelProperty()
    name?: string;

    @ApiModelProperty()
    description?:string;


    @ApiModelProperty()
    regions?:string;

    @ApiModelProperty()
    UID?: string;
    
    @ApiModelProperty()
    classID?: string

    @ApiModelProperty()
    classTagsName?: string;

    @ApiModelProperty()
    location?: LLLocationDTO;
    owner?: string
}

export class FiterQuery {

    @ApiModelProperty()
    className?: string;
    @ApiModelProperty()
    regions?:string;
    @ApiModelProperty()
	lat?: number;
	@ApiModelProperty()
	long?: number;
}