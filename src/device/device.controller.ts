import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Device')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all devices',
    description: 'Get list of all registered devices for the logged-in user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of devices retrieved successfully',
    schema: {
      example: {
        devices: ['iPhone 13', 'MacBook Pro', 'iPad'],
        count: 3,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllDevices(@Request() req) {
    return this.deviceService.getAllDevices(req.user.sub);
  }

  @Delete(':deviceToken')
  @ApiOperation({
    summary: 'Delete a device',
    description: 'Remove a device from user account by device token',
  })
  @ApiParam({
    name: 'deviceToken',
    description: 'Device token to delete',
    example: 'iPhone 13',
  })
  @ApiResponse({
    status: 200,
    description: 'Device deleted successfully',
    schema: {
      example: {
        message: 'Device deleted successfully',
        remainingDevices: 2,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteDevice(@Request() req, @Param('deviceToken') deviceToken: string) {
    return this.deviceService.deleteDevice(req.user.sub, deviceToken);
  }
}
