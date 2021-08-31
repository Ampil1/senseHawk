import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { ResponseBadRequestMessage, ResponseErrorMessage, ResponseSuccessMessage, UserCreateDTO } from 'src/users/users.dto';
import { UserRole } from 'src/users/users.schema';
import { GetUser } from 'src/utils/jwt.strategy';
import { CreateVectorDto, FiterQuery, UpdateVectorDto } from './vectors.dto';
import { VectorsService } from './vectors.service';

@Controller('vectors')
@ApiUseTags('Vectors')
export class VectorsController {
    constructor(private vectorService: VectorsService){}


    
    @Post('/create')
    @ApiOperation({ title: 'create Vector' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async createVector(@GetUser() user: UserCreateDTO, @Body() bodyData: CreateVectorDto): Promise<any> {
        try {
            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            bodyData.owner = user._id;
            bodyData.classID = Date.now();
            bodyData.UID = this.vectorService.generateUniqueCode();
            const response = await this.vectorService.createVector(bodyData);

            if (response) return { response_code: HttpStatus.OK, response_data: "Data Created Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Put('/update/:vectorId')
    @ApiOperation({ title: 'udpate  Vectors' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async updateVector(@GetUser() user: UserCreateDTO, @Param("vectorId") vectorId: string, @Body() bodyData: UpdateVectorDto): Promise<any> {
        try {
            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let dataFilter = { _id: vectorId }
            const getDetails = await this.vectorService.getVectorById(dataFilter);
            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No list found" }
            bodyData.owner = user._id;

            const response = await this.vectorService.updateVectors(vectorId, bodyData);
            if (response) return { response_code: HttpStatus.OK, response_data: "Updated Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/details/:vectorId')
    @ApiOperation({ title: 'Get details of vectorId' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getVectorsDetails(@GetUser() user: UserCreateDTO, @Param("vectorId") vectorId: string): Promise<any> {
        try {
            const getDetails = await this.vectorService.getVectorById({ _id: vectorId });

            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No  list found" }
            if (getDetails) return { response_code: HttpStatus.OK, response_data: getDetails };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }


    @Delete('/detele/:vectorId')
    @ApiOperation({ title: 'Get details of regions' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async delteVectorsDetails(@GetUser() user: UserCreateDTO, @Param("vectorId") vectorId: string): Promise<any> {
        try {

            if (user.role !== UserRole.OWNER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let dataFilter = { _id: vectorId }

            const getDetails = await this.vectorService.getVectorById(dataFilter);
            if (!getDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No Data found" }

            const deleteData = await this.vectorService.deleteVector(dataFilter)
            if (deleteData) return { response_code: HttpStatus.OK, response_data: "data Deleted successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/all/list')
    @ApiOperation({ title: 'Get details of Vectors' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getAllListVectors(@GetUser() user: UserCreateDTO,): Promise<any> {
        try {

            const allList = await Promise.all([
                this.vectorService.getAllVectorList({}),
                this.vectorService.countAllVectorList({}),
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

    //filter API 


    @Get('/filter')
    @ApiOperation({ title: 'Get details of Vectors' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getFilterData(@GetUser() user: UserCreateDTO,@Query() userQuery: FiterQuery): Promise<any> {
        try {
            let filter ={};
            if(userQuery.lat && userQuery.long){
            let longLat = [Number(userQuery.long), Number(userQuery.lat)];
            if(longLat){
            const allList = await Promise.all([
                this.vectorService.getNearByVector(longLat),
            ])
            let resData = {
                data: allList[0]
            }
            if (allList.length > 0) return { response_code: HttpStatus.OK, response_data: resData }
          }
        }
            if(userQuery.className)filter['classTagsName'] = { $regex: userQuery.className, $options: 'i' };
            if(userQuery.regions) filter['regions'] =userQuery.regions;
            const allList = await Promise.all([
                this.vectorService.getAllVectorListClassName(filter),
            ])
            let resData = {
                data: allList[0]
            }
            if (allList.length > 0) return { response_code: HttpStatus.OK, response_data: resData }
           
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

}
