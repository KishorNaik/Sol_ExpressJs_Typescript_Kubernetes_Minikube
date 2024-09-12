import {
	GetDemoRequestDTO,
	GetDemoResponseDTO,
} from '@/modules/demo/contracts/features/v1/getDemo.Contracts';
import { DataResponse, DataResponseFactory } from '@/shared/models/response/data.Response';
import { StatusCodes } from 'http-status-codes';
import { Get, HttpCode, JsonController, OnUndefined, QueryParams } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

// #region Controller Service
@JsonController('/api/v1/demo')
@OpenAPI({ tags: ['demo'] })
export class GetDemoController {
	@Get('/:id')
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@OpenAPI({
		summary: 'Return find a org',
		tags: ['organizations'],
		security: [{ BearerAuth: [] }],
	})
	public async getDemoAsync(
		@QueryParams() query: GetDemoRequestDTO
	): Promise<DataResponse<GetDemoResponseDTO>> {
		console.log(`query: ${JSON.stringify(query)}`);

		const getResponseDTO: GetDemoResponseDTO = new GetDemoResponseDTO();
		getResponseDTO.id = '1';
		getResponseDTO.name = 'test';

		const response: DataResponse<GetDemoResponseDTO> = DataResponseFactory.Response(
			true,
			StatusCodes.OK,
			getResponseDTO,
			'success'
		);

		return Promise.resolve(response);
	}
}
// #endregion
