import {Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, UseGuards, Req} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import type {Request} from "express";

import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import {Payload} from "../../auth/models/payload.model";
import {Post as PostEntity} from '../entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPostDto: CreatePostDto,@Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub; // Extract user ID from the JWT payload
    return this.postsService.create(createPostDto, userId);
  }

  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Post found successfully.', type: PostEntity })
  @ApiOperation({ summary: 'Get a post by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a post by ID' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post by ID' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
