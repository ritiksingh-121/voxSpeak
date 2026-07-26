import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { StartConversationDto } from './dto/start-conversation.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  async start(
    @CurrentUser('id') userId: string,
    @Body() dto: StartConversationDto,
  ) {
    return this.conversationsService.create(userId, dto);
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.conversationsService.findAll(userId, pagination);
  }

  @Get(':id')
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.conversationsService.findOne(userId, id);
  }

  @Delete(':id')
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.conversationsService.remove(userId, id);
    return { message: 'Conversation deleted' };
  }
}
