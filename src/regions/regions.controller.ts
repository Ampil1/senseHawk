import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserRole } from 'src/users/users.schema';
import { GetUser } from 'src/utils/jwt.strategy';
import { ResponseBadRequestMessage, ResponseErrorMessage, ResponseSuccessMessage, UserCreateDTO } from '../users/users.dto';
import { CreateRegionDto, UpdateRegionDto } from './regions.dto';
import { RegionsService } from './regions.service';

@Controller('regions')
@ApiUseTags('Regions')
export class RegionsController {
    constructor(
        private regionsService: RegionsService
    ) { }


    @Post('/create')
    @ApiOperation({ title: 'create Regions' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async createRegion(@GetUser() user: UserCreateDTO, @Body() bodyData: CreateRegionDto): Promise<any> {
        try {
            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            bodyData.owner = user._id;
            bodyData.UID = this.regionsService.generateUniqueCode();
            const response = await this.regionsService.createRegions(bodyData);

            if (response) return { response_code: HttpStatus.OK, response_data: "Region Area Create Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Put('/update/:regionId')
    @ApiOperation({ title: 'udpate  Regions' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async updateRegion(@GetUser() user: UserCreateDTO, @Param("regionId") regionId: string, @Body() bodyData: UpdateRegionDto): Promise<any> {
        try {
            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let dataFilter = { _id: regionId }
            const getDetails = await this.regionsService.getRegionsById(dataFilter);
            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No list found" }
            bodyData.owner = user._id;

            const response = await this.regionsService.updateRegions(regionId, bodyData);
            if (response) return { response_code: HttpStatus.OK, response_data: "Data Updated Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/details/:regionId')
    @ApiOperation({ title: 'Get details of regaion' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getRegionDetails(@GetUser() user: UserCreateDTO, @Param("regionId") regionId: string): Promise<any> {
        try {
            const getDetails = await this.regionsService.getRegionsById({ _id: regionId });

            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No list found" }
            if (getDetails) return { response_code: HttpStatus.OK, response_data: getDetails };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }


    @Delete('/detele/:regionId')
    @ApiOperation({ title: 'Get details of regions' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async delteRegionsDetails(@GetUser() user: UserCreateDTO, @Param("regionId") regionId: string): Promise<any> {
        try {

            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let dataFilter = { _id: regionId }

            const getDetails = await this.regionsService.getRegionsById(dataFilter);
            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No Data found" }

            const deleteData = await this.regionsService.deleteRedions(dataFilter)
            if (deleteData) return { response_code: HttpStatus.OK, response_data: "data Deleted successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/all/list')
    @ApiOperation({ title: 'Get details of Regions' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getAllListRegions(@GetUser() user: UserCreateDTO,): Promise<any> {
        try {

            const allList = await Promise.all([
                this.regionsService.getAllRegionsList({}),
                this.regionsService.countAllRegionsList({}),
            ])
            let resData = {
                data: allList[0],
                count: allList[1]
            }
            if (allList.length > 0) return { response_code: HttpStatus.OK, response_data: resData }
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }
}
