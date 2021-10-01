import {Controller, Get, Req, Post, HttpCode, Header, Redirect, Query, Param} from '@nestjs/common';
import { Request } from 'express';

@Controller('dogs')
export class DogsController {
    @Get()
    findAll(@Req() request: Request): string {
        return 'This action returns all good boyes.'
    }

    @Get('cute') //sub-path
    findSpecific(@Query('test') test): string { // use query param
        return 'A cute doggo named ' + test;
    }

    @Get('default')
    @Redirect('https://nestjs.com', 301) // redirect on URL

    @Post()
    @HttpCode(203) // Send a different HTML status code
    @Header('Cache-Control', 'none') // add some header
    create(): string {
        return 'This action adds a new dog';
    }

    // Route params (e.g. '/dogs/1')
    @Get(':id')
    findOne(@Param() params): string {
        console.log(params.id);
        return `This action returns a #${params.id} dog`;
    }
}
