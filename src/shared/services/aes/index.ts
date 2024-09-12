import { AESRequestDTO } from '@/shared/models/request/aes.RequestDTO';
import { AESResponseDTO } from '@/shared/models/response/aes.ResponseDTO';
import { DataResponse, DataResponseFactory } from '@/shared/models/response/data.Response';
import { aes } from '@/shared/utils/aes';
import { validateOrRejectAsync } from '@/shared/utils/dtoValidation';
import { StatusCodes } from 'http-status-codes';

export const aesDecryptionAndValidationWrapperAsync = async <TRequest extends object>(
	request: AESRequestDTO,
	requestClass: new () => TRequest
): Promise<DataResponse<TRequest>> => {
	try {
		// Decrypt
		const requestBody: string = request.body;
		const decryptRequestBodyStr: string = await aes.decryptAsync(requestBody);
		const requestBodyObject: TRequest = JSON.parse(decryptRequestBodyStr);

		// Validation
		const validationResult = await validateOrRejectAsync<TRequest>(
			requestBodyObject,
			requestClass
		);
		if (validationResult.isErr())
			return DataResponseFactory.Response(
				false,
				StatusCodes.BAD_REQUEST,
				null,
				validationResult.error.message
			);

		// Return
		return DataResponseFactory.Response<TRequest>(
			true,
			StatusCodes.OK,
			requestBodyObject as TRequest,
			null
		);
	} catch (ex) {
		return DataResponseFactory.Response(
			false,
			StatusCodes.INTERNAL_SERVER_ERROR,
			null,
			ex.message
		);
	}
};

export const aesEncryptionWrapperAsync = async <TData extends object>(
	data: DataResponse<TData>
): Promise<DataResponse<AESResponseDTO>> => {
	try {
		if (!data)
			return DataResponseFactory.Response(
				false,
				StatusCodes.BAD_REQUEST,
				null,
				'No data provided'
			);

		// Encryption
		const encryptDataStr: string = await aes.encryptAsync(JSON.stringify(data.Data));
		if (!encryptDataStr)
			return DataResponseFactory.Response(
				false,
				StatusCodes.INTERNAL_SERVER_ERROR,
				null,
				'Failed to encrypt data'
			);

		const aESResponseDTO: AESResponseDTO = new AESResponseDTO();
		aESResponseDTO.body = encryptDataStr;
		return DataResponseFactory.Response<AESResponseDTO>(
			data.Success,
			data.StatusCode,
			aESResponseDTO,
			data.Message
		);
	} catch (ex) {
		return DataResponseFactory.Response(
			false,
			StatusCodes.INTERNAL_SERVER_ERROR,
			null,
			ex.message
		);
	}
};

export const aesDecryptionWrapperAsync = async <TOutputData extends object>(
	data: string
): Promise<DataResponse<TOutputData>> => {
	try {
		if (!data)
			return DataResponseFactory.Response(
				false,
				StatusCodes.BAD_REQUEST,
				null,
				'No data provided'
			);

		// Decrypt
		const decryptRequestBodyStr: string = await aes.decryptAsync(data);
		const requestBodyObject: TOutputData = JSON.parse(decryptRequestBodyStr);

		// Return
		return DataResponseFactory.Response<TOutputData>(
			true,
			StatusCodes.OK,
			requestBodyObject as TOutputData,
			null
		);
	} catch (ex) {
		return DataResponseFactory.Response(
			false,
			StatusCodes.INTERNAL_SERVER_ERROR,
			null,
			ex.message
		);
	}
};
