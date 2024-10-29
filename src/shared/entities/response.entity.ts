export interface ResponseEntity<T> {
  message: string;
  data: T;
  statusCode: number;
}
