import { mock, MockProxy } from 'vitest-mock-extended';

declare global {
  var mock: typeof mock;
  type Mocked<T> = MockProxy<T>;
}
