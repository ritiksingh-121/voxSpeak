import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SaveWordDto } from './dto/save-word.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private vocabularyService: VocabularyService) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.vocabularyService.findAll(userId, { ...pagination, search, status, difficulty });
  }

  @Post()
  async save(@CurrentUser('id') userId: string, @Body() dto: SaveWordDto) {
    return this.vocabularyService.save(userId, dto);
  }

  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: Partial<SaveWordDto>,
  ) {
    return this.vocabularyService.update(userId, id, dto);
  }

  @Delete(':id')
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.vocabularyService.remove(userId, id);
    return { message: 'Word deleted' };
  }

  @Get('weak')
  async getWeakWords(@CurrentUser('id') userId: string) {
    return this.vocabularyService.getWeakWords(userId);
  }
}
