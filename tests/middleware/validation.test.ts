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
      it( 'should return 400 from no token', () => {
        validateTokenMiddleware(mockEmptyRequest, mockResponse, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
      });
    });
  });
});