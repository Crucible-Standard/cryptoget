import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

import {
  validateTokenMiddleware
} from '../../src/middleware/validation';

describe('/middleware', () => {
  describe('/validation.ts', () => {
    describe('validateTokenMiddleware method', () => {
      let mockEmptyRequest: Request;
      let mockValidRequest: Request;
      let mockResponse: Response;
      let mockInvalidRequest: Request;
      let mockInvalidRequestSlack: Request;
      let nextFunction: NextFunction = jest.fn();

      beforeEach(() => {
        process.env = Object.assign(process.env, {
          KL_WCI_API_KEY: 'valid_key',
        });
        mockEmptyRequest = {
          query: {},
        } as Request;
        mockValidRequest = {
          query: {},
        } as Request;
        mockInvalidRequest = {
          query: {},
        } as Request;
        mockInvalidRequestSlack = {
          query: {},
          body: {},
        } as Request;
        mockValidRequest.query = {
          token: 'valid_token', 
        };
        mockInvalidRequest.query = {
          token: 'invalid_token',
        };
        mockInvalidRequestSlack.body = {
          text: 'invalid_token',
        };
        mockResponse = {} as Response;
        mockResponse.send = jest.fn();
        mockResponse.header = jest.fn();
        mockResponse.status = jest.fn(() => mockResponse);
      });
      it( 'should return 400 from invalid query param token', () => {
        validateTokenMiddleware(mockInvalidRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
      it( 'should return 400 from invalid body param token', () => {
        validateTokenMiddleware(mockInvalidRequestSlack, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
      it( 'should return 400 from no token', () => {
        validateTokenMiddleware(mockEmptyRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
      it( 'should return 400 from no key', () => {
        process.env.KL_WCI_API_KEY = null;
        validateTokenMiddleware(mockValidRequest, mockResponse, nextFunction);
        const expected = {"data": {"message": "API Key is missing, Please add an API key to the configuration"}, "meta": {"status": 400}};
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(expected);
      });
    });
  });
});