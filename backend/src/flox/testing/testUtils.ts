import { Repository } from 'typeorm';

/**
 * This file contains various helper types and functions to be used in tests
 */

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // Add other functions as needed in tests
  }),
);
